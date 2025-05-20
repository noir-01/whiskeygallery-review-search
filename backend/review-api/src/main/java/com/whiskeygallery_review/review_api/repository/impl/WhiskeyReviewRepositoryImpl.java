package com.whiskeygallery_review.review_api.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeygallery_review.review_api.entity.QWhiskeyReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import com.whiskeygallery_review.review_api.repository.BaseReviewCustomRepository;

public class WhiskeyReviewRepositoryImpl extends BaseReviewCustomRepositoryImpl<WhiskeyReview> implements BaseReviewCustomRepository<WhiskeyReview> {
    public WhiskeyReviewRepositoryImpl(JPAQueryFactory queryFactory) {
        super(queryFactory, QWhiskeyReview.whiskeyReview, QWhiskeyReview.whiskeyReview.title, QWhiskeyReview.whiskeyReview.nickname);
    }
}
