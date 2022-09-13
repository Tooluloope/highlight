import { SessionCommentCard } from '@components/Comment/SessionComment/SessionComment'
import { MillisToMinutesAndSeconds } from '@util/time'
import { message } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import TransparentPopover from '../../../../components/Popover/TransparentPopover'
import {
	Maybe,
	SanitizedAdmin,
	SessionComment as SessionCommentModelType,
	SessionCommentType,
} from '../../../../graph/generated/schemas'
import CommentPinIcon from '../../../../static/comment-pin.png'
import { useReplayerContext } from '../../ReplayerContext'
import commentButtonStyles from '../PlayerCommentCanvas.module.scss'
import styles from './PlayerSessionComment.module.scss'

interface Props {
	comment: Maybe<
		{ __typename?: 'SessionComment' } & Pick<
			SessionCommentModelType,
			| 'id'
			| 'timestamp'
			| 'created_at'
			| 'session_id'
			| 'updated_at'
			| 'text'
			| 'x_coordinate'
			| 'y_coordinate'
			| 'project_id'
			| 'type'
			| 'session_secure_id'
			| 'tags'
			| 'attachments'
			| 'replies'
		> & {
				author?: Maybe<
					{ __typename?: 'SanitizedAdmin' } & Pick<
						SanitizedAdmin,
						'id' | 'name' | 'email' | 'photo_url'
					>
				>
			}
	>
	deepLinkedCommentId: string | null
}

/**
 * A comment that is rendered onto the Player relative to where the comment was made.
 */
const PlayerSessionComment = ({ comment, deepLinkedCommentId }: Props) => {
	const { pause } = useReplayerContext()
	const [visible, setVisible] = useState(deepLinkedCommentId === comment?.id)
	const [clicked, setClicked] = useState(deepLinkedCommentId === comment?.id)
	const commentCardParentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (deepLinkedCommentId) {
			setVisible(deepLinkedCommentId === comment?.id)
		}
	}, [comment?.id, deepLinkedCommentId])

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key == 'Escape') {
				setVisible(false)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	if (!comment) {
		return null
	}

	// This case is true when the comment is a non-ADMIN type comment.
	if (
		comment.x_coordinate == null ||
		comment.y_coordinate == null ||
		comment.timestamp == null ||
		comment.type !== SessionCommentType.Admin
	) {
		return null
	}

	return (
		<div
			key={comment.id}
			className={styles.comment}
			style={{
				left: `calc(${
					comment.x_coordinate * 100
				}% - (var(--comment-indicator-width) / 2))`,
				top: `calc(${
					comment.y_coordinate * 100
				}% - var(--comment-indicator-height) + 2px)`,
			}}
			onClick={(e) => {
				e.stopPropagation()
				setClicked(true)
			}}
			onMouseEnter={() => {
				setVisible(true)
			}}
			onMouseLeave={() => {
				if (!clicked) {
					setVisible(false)
				}
			}}
		>
			<TransparentPopover
				placement="right"
				content={
					<div
						className={styles.sessionCommentCardContainer}
						ref={commentCardParentRef}
					>
						<SessionCommentCard
							parentRef={commentCardParentRef}
							comment={comment}
							onClose={() => setVisible(false)}
							deepLinkedCommentId={deepLinkedCommentId}
							scrollReplies
							hasShadow
						/>
					</div>
				}
				align={{ offset: [0, 12] }}
				visible={visible}
				defaultVisible={deepLinkedCommentId === comment.id}
				// Sets the Popover's mount node as the player center panel.
				// The default is document.body
				// We override here to be able to show the comments when the player is in fullscreen
				// Without this, the new comment modal would be below the fullscreen view.
				getPopupContainer={() => {
					const playerCenterPanel =
						document.getElementById('playerCenterPanel')

					if (playerCenterPanel) {
						return playerCenterPanel
					}

					return document.body
				}}
			>
				<button
					onClick={() => {
						pause(comment.timestamp as number)
						message.success(
							`Changed player time to where comment was created at ${MillisToMinutesAndSeconds(
								comment.timestamp as number,
							)}.`,
						)
					}}
					className={classNames(
						commentButtonStyles.commentIndicator,
						styles.commentPinButton,
					)}
				>
					<img src={CommentPinIcon} alt={'comment pin icon'} />
				</button>
			</TransparentPopover>
		</div>
	)
}

export default PlayerSessionComment