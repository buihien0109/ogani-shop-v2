package com.example.ogani.service;

import com.example.ogani.entity.Product;
import com.example.ogani.entity.Supplier;
import com.example.ogani.entity.Transaction;
import com.example.ogani.entity.TransactionItem;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.CreateTransactionRequest;
import com.example.ogani.model.request.UpdateTransactionRequest;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.repository.SupplierRepository;
import com.example.ogani.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final SupplierRepository supplierRepository;


    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll(Sort.by(Sort.Order.desc("transactionDate")));
    }

    public Transaction getTransactionById(Integer id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch với id: " + id));
    }

    public List<Transaction> getTransactionsBySupplier(Integer supplierId) {
        if (!supplierRepository.existsById(supplierId)) {
            throw new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + supplierId);
        }
        return transactionRepository.findBySupplier_Id(supplierId, Sort.by(Sort.Order.desc("transactionDate")));
    }

    public Transaction createTransaction(CreateTransactionRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + request.getSupplierId()));

        // create transaction
        Transaction transaction = new Transaction();
        transaction.setSenderName(request.getSenderName());
        transaction.setReceiverName(request.getReceiverName());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setSupplier(supplier);

        // create transaction items
        request.getTransactionItems().forEach(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + item.getProductId()));

            TransactionItem transactionItem = new TransactionItem();
            transactionItem.setQuantity(item.getQuantity());
            transactionItem.setPurchasePrice(item.getPurchasePrice());
            transactionItem.setProduct(product);
            transactionItem.setTransaction(transaction);
            transaction.getTransactionItems().add(transactionItem);
        });

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Integer id, UpdateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch với id: " + id));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + request.getSupplierId()));

        transaction.setSenderName(request.getSenderName());
        transaction.setReceiverName(request.getReceiverName());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setSupplier(supplier);

        return transactionRepository.save(transaction);
    }
}
