export const v4 = (): string => {
	const randomPart = Math.floor(Math.random() * 1_000_000_000_000)
		.toString()
		.padStart(12, '0');
	return `00000000-0000-4000-8000-${randomPart}`;
};
