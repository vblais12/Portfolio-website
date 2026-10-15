export const NotFound = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center bg-bg text-fg font-sans">
            <p className="m-0 text-[clamp(96px,16vw,168px)] font-bold tracking-[-0.055em] leading-[.95] text-brand">404</p>
            <h1 className="m-0 text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.035em]">Page not found.</h1>
            <p className="m-0 text-[17px] leading-[1.45] text-mut2 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <a
                href="/"
                className="mt-4 bg-acc text-white py-[13px] px-[26px] rounded-full text-[17px] font-medium transition-transform duration-300 ease-soft hover:scale-[1.04]"
            >
                ‹ Back home
            </a>
        </div>
    )
}
