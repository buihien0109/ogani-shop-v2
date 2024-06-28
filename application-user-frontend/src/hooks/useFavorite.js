import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddFavoriteMutation, useDeleteFavoriteMutation } from "../app/apis/favorite.api";
import { addFavorite as addFavoriteLocal, deleteFavorite as deleteFavoriteLocal } from "../app/slices/favorite.slice";

const useFavorite = (productId) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const favorites = useSelector(state => state.favorites);
    const isFavorite = favorites.includes(productId);

    const [addFavorite] = useAddFavoriteMutation();
    const [deleteFavorite] = useDeleteFavoriteMutation();

    const handleFavorite = () => {
        if (isAuthenticated) {
            if (isFavorite) {
                handleDeleteFavorite(productId);
            } else {
                handleAddFavorite(productId);
            }
        } else {
            if (isFavorite) {
                handleDeleteFromFavoriteLocal(productId);
            } else {
                handleAddFavoriteLocal(productId);
            }
        }
    }

    const handleAddFavorite = (productId) => {
        addFavorite({ productId })
            .unwrap()
            .then((res) => {
                toast.success("Thêm vào yêu thích thành công");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    const handleDeleteFavorite = (productId) => {
        deleteFavorite(productId)
            .unwrap()
            .then((res) => {
                toast.success("Loại khỏi yêu thích thành công");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    const handleAddFavoriteLocal = (productId) => {
        dispatch(addFavoriteLocal({ productId }));
        toast.success("Thêm vào yêu thích thành công");
    }

    const handleDeleteFromFavoriteLocal = (productId) => {
        dispatch(deleteFavoriteLocal({ productId }));
        toast.success("Loại khỏi yêu thích thành công");
    }

    return { isFavorite, handleFavorite };
}

export default useFavorite;