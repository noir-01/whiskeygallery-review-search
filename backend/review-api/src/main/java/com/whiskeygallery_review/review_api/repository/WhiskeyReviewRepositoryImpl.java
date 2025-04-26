package com.whiskeygallery_review.review_api.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeygallery_review.review_api.entity.QWhiskeyReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;

public class WhiskeyReviewRepositoryImpl extends BaseReviewCustomRepositoryImpl<WhiskeyReview> implements BaseReviewCustomRepository<WhiskeyReview> {
    public WhiskeyReviewRepositoryImpl(JPAQueryFactory queryFactory) {
        super(queryFactory, QWhiskeyReview.whiskeyReview, QWhiskeyReview.whiskeyReview.title, QWhiskeyReview.whiskeyReview.nickname);
    }
}
