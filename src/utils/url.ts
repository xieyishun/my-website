export const withBase = (path: string) => {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}
	const base = import.meta.env.BASE_URL || '/';
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;
	const normalizedPath = path.replace(/^\/+/, '');
	return `${normalizedBase}${normalizedPath}`;
};
