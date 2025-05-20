package com.whiskeygallery_review.review_api.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeygallery_review.review_api.entity.OtherReview;
import com.whiskeygallery_review.review_api.entity.QOtherReview;
import com.whiskeygallery_review.review_api.repository.BaseReviewCustomRepository;

public class OtherReviewRepositoryImpl extends BaseReviewCustomRepositoryImpl<OtherReview> implements BaseReviewCustomRepository<OtherReview> {
    public OtherReviewRepositoryImpl(JPAQueryFactory queryFactory) {
        super(queryFactory, QOtherReview.otherReview, QOtherReview.otherReview.title, QOtherReview.otherReview.nickname);
    }
}
