package com.example.ogani.service;

import com.example.ogani.entity.Product;
import com.example.ogani.entity.Transaction;
import com.example.ogani.entity.TransactionItem;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertTransactionItemRequest;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.repository.TransactionItemRepository;
import com.example.ogani.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionItemService {
    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final ProductRepository productRepository;

    public TransactionItem createTransactionItem(Integer transactionId, UpsertTransactionItemRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy transaction với id: " + transactionId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy product với id: " + request.getProductId()));

        TransactionItem transactionItem = TransactionItem.builder()
                .quantity(request.getQuantity())
                .purchasePrice(request.getPurchasePrice())
                .product(product)
                .transaction(transaction)
                .build();
        return transactionItemRepository.save(transactionItem);
    }

    public TransactionItem updateTransactionItem(Integer transactionId, Integer itemId, UpsertTransactionItemRequest request) {
        TransactionItem transactionItem = transactionItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy transaction Item với id: " + itemId));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy transaction với id: " + transactionId));

        if (!transactionItem.getTransaction().getId().equals(transaction.getId())) {
            throw new BadRequestException("Transaction Item không thuộc transaction này");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy product với id: " + request.getProductId()));

        transactionItem.setQuantity(request.getQuantity());
        transactionItem.setPurchasePrice(request.getPurchasePrice());
        transactionItem.setProduct(product);

        return transactionItemRepository.save(transactionItem);
    }

    public void deleteTransactionItem(Integer transactionId, Integer itemId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy transaction với id: " + transactionId));
        TransactionItem transactionItem = transactionItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy transaction Item với id: " + itemId));

        if (!transactionItem.getTransaction().getId().equals(transaction.getId())) {
            throw new BadRequestException("Transaction Item không thuộc transaction này");
        }

        transactionItemRepository.delete(transactionItem);
    }
}
