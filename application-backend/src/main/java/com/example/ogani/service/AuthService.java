package com.example.ogani.service;


import com.example.ogani.entity.RefreshToken;
import com.example.ogani.entity.Role;
import com.example.ogani.entity.TokenConfirm;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.enums.TokenType;
import com.example.ogani.model.mapper.UserMapper;
import com.example.ogani.model.request.LoginRequest;
import com.example.ogani.model.request.RefreshTokenRequest;
import com.example.ogani.model.request.RegisterRequest;
import com.example.ogani.model.request.ResetPasswordRequest;
import com.example.ogani.model.response.AuthResponse;
import com.example.ogani.model.response.VerifyTokenResponse;
import com.example.ogani.repository.RefreshTokenRepository;
import com.example.ogani.repository.RoleRepository;
import com.example.ogani.repository.TokenConfirmRepository;
import com.example.ogani.repository.UserRepository;
import com.example.ogani.security.CustomUserDetails;
import com.example.ogani.security.JwtUtils;
import com.example.ogani.security.SecurityUtils;
import com.example.ogani.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenConfirmRepository tokenConfirmRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final MailService mailService;

    @Value("${application.security.refresh-token.expiration}")
    private long refreshTokenExpiration;

    public AuthResponse login(LoginRequest request) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String tokenJwt = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có email = " + request.getEmail()));
        String refreshToken = UUID.randomUUID().toString();
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .expiredAt(LocalDateTime.now().plus(refreshTokenExpiration, ChronoUnit.MILLIS))
                .user(user)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResponse.builder()
                .user(userMapper.toUserDto(user))
                .accessToken(tokenJwt)
                .refreshToken(refreshToken)
                .isAuthenticated(true)
                .build();
    }

    @Transactional
    public void logout() {
        User user = SecurityUtils.getCurrentUserLogin();
        if (user == null) {
            throw new ResourceNotFoundException("Tài khoản không tồn tại");
        }
        refreshTokenRepository.logOut(user.getId());
        SecurityContextHolder.clearContext();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh Token");
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndInvalidated(request.getRefreshToken(), false)
                .orElseThrow(() -> new BadRequestException("Refresh token không hợp lệ"));

        if (refreshToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            refreshToken.setInvalidated(true);
            refreshTokenRepository.save(refreshToken);
            throw new BadRequestException("Refresh token đã hết hạn");
        }

        User user = refreshToken.getUser();
        CustomUserDetails userDetails = new CustomUserDetails(user);

        String tokenJwt = jwtUtils.generateToken(userDetails);
        return AuthResponse.builder()
                .user(userMapper.toUserDto(user))
                .accessToken(tokenJwt)
                .refreshToken(request.getRefreshToken())
                .isAuthenticated(true)
                .build();
    }

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email đã tồn tại");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp với mật khẩu");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role không tồn tại"));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatar(StringUtils.generateLinkImage(request.getName()))
                .enabled(false)
                .roles(Collections.singleton(userRole))
                .build();
        userRepository.save(user);
        log.info("New user registered: {}", user);

        TokenConfirm tokenConfirm = TokenConfirm.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .type(TokenType.EMAIL_VERIFICATION)
                .expiredAt(LocalDateTime.now().plusDays(1))
                .build();
        tokenConfirmRepository.save(tokenConfirm);
        log.info("Token confirm created: {}", tokenConfirm);

        // send email
        Map<String, String> data = new HashMap<>();
        data.put("email", user.getEmail());
        data.put("username", user.getName());
        data.put("token", tokenConfirm.getToken());
        mailService.sendMailConfirmRegistration(data);
        log.info("Email sent to: {}", user.getEmail());
    }

    @Transactional
    public VerifyTokenResponse checkRegisterToken(String token) {
        VerifyTokenResponse response = VerifyTokenResponse.builder()
                .token(token)
                .success(true)
                .message("Xác thực tài khoản thành công")
                .build();

        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(token, TokenType.EMAIL_VERIFICATION);

        if (tokenConfirmOptional.isPresent()) {
            TokenConfirm tokenConfirm = tokenConfirmOptional.get();

            // Kiểm tra nếu token đã được xác nhận
            if (tokenConfirm.getConfirmedAt() != null) {
                response.setSuccess(false);
                response.setMessage("Token xác thực tài khoản đã được xác nhận");
            }
            // Kiểm tra nếu token đã hết hạn
            else if (tokenConfirm.getExpiredAt().isBefore(LocalDateTime.now())) {
                response.setSuccess(false);
                response.setMessage("Token xác thực tài khoản đã hết hạn");
            }

            // Xác thực tài khoản
            User user = tokenConfirm.getUser();
            user.setEnabled(true);
            userRepository.save(user);

            tokenConfirm.setConfirmedAt(LocalDateTime.now());
            tokenConfirmRepository.save(tokenConfirm);
        } else {
            response.setSuccess(false);
            response.setMessage("Token xác thực tài khoản không hợp lệ");
        }

        return response;
    }

    public void forgotPassword(String email) {
        log.info("email: {}", email);
        // check email exist
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy email"));
        log.info("user: {}", user);
        log.info("user.getEmail(): {}", user.getEmail());

        // Create token confirm
        log.info("Create token confirm");
        TokenConfirm tokenConfirm = new TokenConfirm();
        tokenConfirm.setToken(UUID.randomUUID().toString());
        tokenConfirm.setUser(user);
        tokenConfirm.setType(TokenType.PASSWORD_RESET);
        // set expiry date after 1 day
        tokenConfirm.setExpiredAt(LocalDateTime.now().plusDays(1));
        tokenConfirmRepository.save(tokenConfirm);

        // send email
        log.info("Send email");
        Map<String, String> data = new HashMap<>();
        data.put("email", user.getEmail());
        data.put("username", user.getName());
        data.put("token", tokenConfirm.getToken());

        mailService.sendMailResetPassword(data);

        log.info("Send mail success");
    }

    @Transactional
    public void changePassword(ResetPasswordRequest request) {
        // check new password and confirm password
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu mới và mật khẩu xác nhận không khớp");
        }

        // get token confirm
        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(request.getToken(), TokenType.PASSWORD_RESET);

        if (tokenConfirmOptional.isEmpty()) {
            throw new BadRequestException("Token đặt lại mật khẩu không hợp lệ");
        }

        TokenConfirm tokenConfirm = tokenConfirmOptional.get();
        if (tokenConfirm.getConfirmedAt() != null) {
            throw new BadRequestException("Token đặt lại mật khẩu đã được xác nhận");
        }

        if (tokenConfirm.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token đặt lại mật khẩu đã hết hạn");
        }

        User user = tokenConfirm.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenConfirm.setConfirmedAt(LocalDateTime.now());
        tokenConfirmRepository.save(tokenConfirm);

        log.info("Đặt lại mật khẩu thành công");
    }

    @Transactional
    public VerifyTokenResponse checkForgotPasswordToken(String token) {
        VerifyTokenResponse response = VerifyTokenResponse.builder()
                .token(token)
                .success(true)
                .message("Token đặt lại mật khẩu hợp lệ")
                .build();

        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(token, TokenType.PASSWORD_RESET);

        if (tokenConfirmOptional.isPresent()) {
            TokenConfirm tokenConfirm = tokenConfirmOptional.get();

            // Kiểm tra nếu token đã được xác nhận
            if (tokenConfirm.getConfirmedAt() != null) {
                response.setSuccess(false);
                response.setMessage("Token đặt lại mật khẩu đã được xác nhận");
            }
            // Kiểm tra nếu token đã hết hạn
            else if (tokenConfirm.getExpiredAt().isBefore(LocalDateTime.now())) {
                response.setSuccess(false);
                response.setMessage("Token đặt lại mật khẩu đã hết hạn");
            }
        } else {
            response.setSuccess(false);
            response.setMessage("Token đặt lại mật khẩu không hợp lệ");
        }
        return response;
    }
}
