import select from 'select-dom';
import {h} from 'dom-chef';
import * as pageDetect from './page-detect';

export default () => {
	let op;
	if (pageDetect.isPR()) {
		const titleRegex = /^(?:.+) by (\S+) · Pull Request #(\d+)/;
		[, op] = titleRegex.exec(document.title) || [];
	} else {
		op = select('.timeline-comment-header-text .author').textContent;
	}

	let newComments = $(`.js-comment:not(.refined-github-op)`).has(`strong .author[href="/${op}"]`).get();

	if (!pageDetect.isPRFiles()) {
		newComments = newComments.slice(1);
	}

	if (newComments.length === 0) {
		return;
	}

	const placeholders = select.all(`
		.timeline-comment .timeline-comment-header-text,
		.review-comment .comment-body
	`, newComments);

	for (const placeholder of placeholders) {
		placeholder.insertAdjacentElement('beforeBegin',
			<span class="timeline-comment-label">
				Original&nbsp;Poster
			</span>
		);
	}

	for (const el of newComments) {
		el.classList.add('refined-github-op');
	}
};
