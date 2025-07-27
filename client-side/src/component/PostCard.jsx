import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="group relative flex flex-col border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg transition-all bg-white dark:bg-gray-900">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300"
        />
      </Link>

      <div className="p-3 flex flex-col gap-2 flex-grow relative">
        <p className="text-lg font-semibold line-clamp-2 text-gray-800 dark:text-gray-200">
          {post.title}
        </p>
        <span className="italic text-sm text-gray-600 dark:text-gray-400">
          {post.category}
        </span>

        {/* Read Article button */}
        <Link
          to={`/post/${post.slug}`}
          className="absolute bottom-[-200px] left-0 right-0 z-10 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 group-hover:bottom-0"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
