import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../app/apis/cart.api";
import { addToCart as addToCartLocal } from "../app/slices/cart.slice";

const useCart = (product) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const [quantity, setQuantity] = useState(1);

    const [addToCart, { isLoading }] = useAddToCartMutation();

    const handleIncreaseQuantity = () => {
        const newCount = quantity + 1;
        if (newCount <= product.stockQuantity) {
            setQuantity(quantity => quantity + 1);
        } else {
            toast.warn("Số lượng sản phẩm trong kho không đủ");
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity => quantity - 1);
        }
    }

    const handleAddToCart = () => {
        const cartItem = cart.find(item => item.productId == product.id);
        const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;
        if (newQuantity > product.stockQuantity) {
            toast.warn("Số lượng sản phẩm trong kho không đủ");
            return;
        }

        if (isAuthenticated) {
            addToCart({ productId: product.id, quantity })
                .unwrap()
                .then((response) => {
                    toast.success("Thêm vào giỏ hàng thành công");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message)
                })
        } else {
            dispatch(addToCartLocal({ productId: product.id, quantity }));
            toast.success("Thêm vào giỏ hàng thành công");
        }
    }

    return {
        quantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleAddToCart,
    }
}

export default useCart;