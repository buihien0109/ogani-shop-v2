import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import slugify from 'slugify';

function TableOfContents({blog}) {
    const [headings, setHeadings] = useState([]);
    const [activeHeadingId, setActiveHeadingId] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        const headingsArray = [];

        const traverseHeadings = (elements) => {
            Array.from(elements).forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                const id = slugify(heading.textContent, { lower: true, trim: true })
                heading.id = id;
                const text = heading.textContent;

                headingsArray.push({
                    id,
                    text,
                    level,
                    element: heading
                });
            });
        };

        const contentEl = document.getElementById('blog-detail');
        const topLevelHeadings = contentEl.querySelectorAll('h2, h3, h4');
        traverseHeadings(topLevelHeadings);
        setHeadings(headingsArray);
    }, [blog]);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveHeadingId(entry.target.id);
                }
            });
        }, { rootMargin: "-20% 0% -35% 0px" });

        headings.forEach(heading => {
            observer.current.observe(heading.element);
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [headings]);

    const scrollToHeading = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderHeadings = (headings) => {
        return (
            <ul className='list-unstyled ps-2'>
                {headings.map(heading => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={`text-gray-500 text-small d-block p-2 level-${heading.level} ${activeHeadingId === heading.id ? 'active' : ''}`}
                            onClick={(e) => scrollToHeading(e, heading.id)}>
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            {headings.length > 0 && (
                <div className="blog__sidebar__item">
                    <h4 className="mb-3">Mục lục bài viết</h4>
                    <div className="toc-container border-start" id="toc-container">
                        {renderHeadings(headings)}
                    </div>
                </div>
            )}
        </>
    );
}

export default TableOfContents;