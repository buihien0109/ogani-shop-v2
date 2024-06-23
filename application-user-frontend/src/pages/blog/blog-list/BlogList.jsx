import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useGetBlogsQuery, useGetLatestBlogsQuery } from '../../../app/apis/blog.api';
import { useGetTagsQuery } from '../../../app/apis/tag.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatDate } from '../../../utils/functionUtils';

function BlogList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    let page = searchParams.get('page') || 1;
    let limit = searchParams.get('limit') || 6;
    let tag = searchParams.get('tag');
    let search = searchParams.get('search');
    const [searchInput, setSearchInput] = useState("");

    const { data: blogData, isLoading: isLoadingGetBlogs, isError: isErrorGetBlogs } = useGetBlogsQuery({
        page: page,
        limit: limit,
        search: search,
        tag: tag
    }, { refetchOnMountOrArgChange: true })
    const { data: tags, isLoading: isLoadingGetTags, isError: isErrorGetTags } = useGetTagsQuery();
    const { data: latestBlogs, isLoading: isLoadingGetLatestBlogs, isError: isErrorGetLatestBlogs } = useGetLatestBlogsQuery({ limit: 5 });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [searchParams])

    if (isLoadingGetBlogs || isLoadingGetTags || isLoadingGetLatestBlogs) {
        return <Loading />
    }

    if (isErrorGetBlogs || isErrorGetTags || isErrorGetLatestBlogs) {
        return <ErrorPage />
    }

    const handlePageChange = (page) => {
        const params = Object.fromEntries([...searchParams]);
        params.page = page;
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput) {
            navigate(`/bai-viet?search=${searchInput}`);
        }
    }

    return (
        <>
            <Helmet>
                <title>Bài viết</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>Bài viết</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blog spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {blogData?.content.length === 0 && (
                                    <h4>Không tìm thấy bài viết phù hợp</h4>
                                )}
                                {blogData?.content.map(blog => (
                                    <div key={blog.id} className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="blog__item">
                                            <div className="blog__item__pic">
                                                <img src={blog.thumbnail} alt={blog.title} />
                                            </div>
                                            <div className="blog__item__text">
                                                <ul>
                                                    <li>
                                                        <i className="fa fa-calendar-o"></i>
                                                        {formatDate(blog.publishedAt)}
                                                    </li>
                                                </ul>
                                                <h5>
                                                    <Link
                                                        to={`/bai-viet/${blog.id}/${blog.slug}`}
                                                        className="line-clamp-2"
                                                    >{blog.title}</Link>
                                                </h5>
                                                <p className="line-clamp-2">{blog.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                {blogData?.totalPages > 1 && (
                                    <Pagination
                                        current={page}
                                        total={blogData.totalElements}
                                        pageSize={blogData.size}
                                        onChange={handlePageChange}
                                        className='text-center'
                                        hideOnSinglePage={true}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog__sidebar">
                                <div className="blog__sidebar__search">
                                    <form id="blog-form-search" onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="rounded"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                        <button type="submit">
                                            <span className="icon_search"><i className="fa-solid fa-magnifying-glass"></i></span>
                                        </button>
                                    </form>
                                </div>

                                <div className="blog__sidebar__item">
                                    <h4 className="mb-3">Bài viết gần đây</h4>
                                    <div className="blog__sidebar__recent">
                                        {latestBlogs?.map(blog => (
                                            <Link
                                                key={blog.id}
                                                to={`/bai-viet/${blog.id}/${blog.slug}`}
                                                className="blog__sidebar__recent__item"
                                            >
                                                <div className="blog__sidebar__recent__item__pic">
                                                    <img src={blog.thumbnail} alt={blog.title} />
                                                </div>
                                                <div className="blog__sidebar__recent__item__text">
                                                    <h6 className="line-clamp-2">{blog.title}</h6>
                                                    <span>{formatDate(blog.publishedAt)}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="blog__sidebar__item">
                                    <h4 className="mb-3">Danh mục</h4>
                                    <div className="tag-list">
                                        {tags?.map(tag => (
                                            <Link key={tag.id} to={`/bai-viet?tag=${tag.slug}`}>{tag.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlogList