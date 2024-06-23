import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useGetBlogDetailQuery, useGetLatestBlogsQuery, useGetRecommendBlogsQuery } from '../../../app/apis/blog.api';
import { useGetTagsQuery } from '../../../app/apis/tag.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatDate } from '../../../utils/functionUtils';
import TableOfContents from '../components/toc/TableOfContents';

function BlogDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { blogId, blogSlug } = useParams();
    const [searchInput, setSearchInput] = useState("");

    const {
        data: blog,
        isLoading: isLoadingGetBlog,
        isError: isErrorGetBlog
    } = useGetBlogDetailQuery({ blogId, blogSlug });

    const {
        data: latestBlogs,
        isLoading: isLoadingGetLatestBlogs,
        isError: isErrorGetLatestBlogs
    } = useGetLatestBlogsQuery({ limit: 6 });

    const {
        data: recommendBlogs,
        isLoading: isLoadingRecommendBlogs,
        isError: isErrorRecommendBlogs
    } = useGetRecommendBlogsQuery({ blogId: blogId, limit: 6 });

    const { data: tags, isLoading: isLoadingGetTags, isError: isErrorGetTags } = useGetTagsQuery();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [location])

    if (isLoadingGetBlog || isLoadingGetLatestBlogs || isLoadingRecommendBlogs || isLoadingGetTags) {
        return <Loading />
    }

    if (isErrorGetBlog || isErrorGetLatestBlogs || isErrorRecommendBlogs || isErrorGetTags) {
        return <ErrorPage />
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput) {
            navigate(`/bai-viet?search=${searchInput}`);
        }
    }

    return (
        <>
            <Helmet>
                <title>{blog.title}</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog__details__hero__text">
                                <h2>{blog.title}</h2>
                                <ul>
                                    <li>{blog.user.name}</li>
                                    <li>{formatDate(blog.publishedAt)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blog-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div
                                className="blog__details__text"
                                id="blog-detail"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            >
                            </div>
                            <div className="blog__details__content">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="blog__details__author">
                                            <div className="blog__details__author__pic">
                                                <img src={blog.user.avatar} alt={blog.user.name} />
                                            </div>
                                            <div className="blog__details__author__text">
                                                <h6>{blog.user.name}</h6>
                                                <span>Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="blog__details__widget">
                                            <ul>
                                                <li>
                                                    <span>Danh mục:</span>&nbsp;
                                                    {blog.tags.map((tag, index) => (
                                                        <Link
                                                            key={tag.id}
                                                            to={`/bai-viet?tag=${tag.slug}`}
                                                            className="text-primary d-inline-block me-1 font-weight-normal">
                                                            {tag.name}{index < blog.tags.length - 1 ? ', ' : ''}
                                                        </Link>
                                                    ))}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog__sidebar position-sticky" style={{ top: "1.5rem" }}>
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

                                <TableOfContents blog={blog} />

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
                                    <h4 className="mb-3">Bài viết liên quan</h4>
                                    <div className="blog__sidebar__recent">
                                        {recommendBlogs?.map(blog => (
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

export default BlogDetails