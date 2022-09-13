import * as React from 'react'

function SvgStar(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 64"
			width="1em"
			height="1em"
			{...props}
		>
			<path d="M63.5 24c-.5-1.9-2.1-3.2-4-3.5l-16-2.4-7.2-15.2C35.5 1.1 33.9 0 32.1 0c-1.9 0-3.7 1.1-4.5 2.9l-7.2 15.2-16 2.7c-1.9.3-3.5 1.6-4 3.5S.1 28 1.5 29.6l11.7 12-2.7 16.8c-.3 1.9.5 4 2.1 5.1.8.3 1.9.5 2.7.5s1.6-.3 2.4-.5l14.4-7.7 14.4 7.7c1.6.8 3.7.8 5.1-.3 1.6-1.1 2.4-2.9 2.1-5.1L51 41.3l11.7-12c1.1-1.3 1.6-3.4.8-5.3zm-17 14.1c-.8.8-1.1 1.9-1.1 3.2l2.9 17.1-14.7-8c-.5-.3-1.1-.5-1.6-.5s-1.1.3-1.6.5l-14.4 8 2.7-17.1c.3-1.1-.3-2.4-1.1-3.2l-12-12.3 16.5-2.7c1.1-.3 2.1-1.1 2.7-2.1L32 5.8 39.2 21c.5 1.1 1.6 1.9 2.7 2.1l16.5 2.7-11.9 12.3z" />
		</svg>
	)
}

export default SvgStar