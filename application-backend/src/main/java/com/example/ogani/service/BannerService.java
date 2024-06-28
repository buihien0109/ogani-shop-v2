package com.example.ogani.service;

import com.example.ogani.entity.Banner;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.BannerDto;
import com.example.ogani.model.mapper.BannerMapper;
import com.example.ogani.model.request.SortBannerRequest;
import com.example.ogani.model.request.UpsertBannerRequest;
import com.example.ogani.repository.BannerRepository;
import com.example.ogani.utils.StringUtils;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerService {
    private final BannerRepository bannerRepository;
    private final Slugify slugify;
    private final BannerMapper bannerMapper;

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll(Sort.by("createdAt").descending());
    }

    public List<BannerDto> getAllBannersActive() {
        List<Banner> banners = bannerRepository.findByStatus(true, Sort.by("displayOrder").ascending());
        return banners.stream()
                .map(bannerMapper::toBannerDto)
                .toList();
    }

    public List<Banner> getAllBannersActiveByAdmin() {
        return bannerRepository.findByStatus(true, Sort.by("displayOrder").ascending());
    }

    public Banner getBannerById(Integer id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + id));
    }

    public Banner createBanner(UpsertBannerRequest request) {
        Banner banner = Banner.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .thumbnail(request.getThumbnail() != null ? request.getThumbnail() : StringUtils.generateLinkImage(request.getName()))
                .linkRedirect(request.getLinkRedirect())
                .status(request.getStatus())
                .build();

        // check banner status = true => set displayOrder = length of banners status = true + 1
        if (request.getStatus()) {
            List<Banner> banners = bannerRepository.findByStatus(true);
            banner.setDisplayOrder(banners.size() + 1);
        }

        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Integer id, UpsertBannerRequest request) {
        // check if banner status change true -> false
        boolean isUpdateDisplayOrder = false;

        // find banner by id
        Banner bannerToUpdate = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + id));

        // if banner status = false and request status = true => set displayOrder = length of banners status = true + 1
        if (!bannerToUpdate.getStatus() && request.getStatus()) {
            List<Banner> banners = bannerRepository.findByStatus(true);
            bannerToUpdate.setDisplayOrder(banners.size() + 1);
        }

        // if banner status = true and request status = false => set displayOrder = null and update displayOrder of banners status = true
        if (bannerToUpdate.getStatus() && !request.getStatus()) {
            bannerToUpdate.setDisplayOrder(null);
            isUpdateDisplayOrder = true;
        }

        // update banner
        bannerToUpdate.setName(request.getName());
        bannerToUpdate.setSlug(slugify.slugify(request.getName()));
        bannerToUpdate.setThumbnail(request.getThumbnail() != null ? request.getThumbnail() : StringUtils.generateLinkImage(request.getName()));
        bannerToUpdate.setLinkRedirect(request.getLinkRedirect());
        bannerToUpdate.setStatus(request.getStatus());

        log.info("bannerToUpdate: {}", bannerToUpdate);
        bannerRepository.save(bannerToUpdate);

        // check if banner status change true -> false => update displayOrder of banners status = true
        if (isUpdateDisplayOrder) {

            // update displayOrder of banners status = true
            List<Banner> banners = bannerRepository.findByStatus(true);

            // Sort banners by displayOrder ascending
            List<Banner> bannersSorted = banners.stream().sorted(Comparator.comparingInt(Banner::getDisplayOrder)).toList();

            // update displayOrder of banners status = true
            for (int i = 0; i < bannersSorted.size(); i++) {
                bannersSorted.get(i).setDisplayOrder(i + 1);
                bannerRepository.save(bannersSorted.get(i));
            }
        }

        return bannerToUpdate;
    }

    public void deleteBanner(Integer id) {
        Banner bannerToDelete = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + id));

        if (bannerToDelete.getStatus()) {
            throw new BadRequestException("Không thể xóa banner đang được hiển thị");
        }

        bannerRepository.delete(bannerToDelete);
    }

    public void sortBanners(SortBannerRequest request) {
        List<Integer> ids = request.getBannerIds();

        for (int i = 0; i < ids.size(); i++) {
            Integer bannerId = ids.get(i);
            Banner banner = bannerRepository.findById(bannerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + bannerId));

            if (!banner.getStatus()) {
                throw new RuntimeException("Không thể sắp xếp banner đang bị vô hiệu hóa");
            }
            banner.setDisplayOrder(i + 1);
            bannerRepository.save(banner);
        }
    }
}
