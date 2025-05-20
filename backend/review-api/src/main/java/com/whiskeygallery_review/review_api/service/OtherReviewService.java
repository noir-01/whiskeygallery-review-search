package com.whiskeygallery_review.review_api.service;

import com.whiskeygallery_review.review_api.entity.OtherReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import com.whiskeygallery_review.review_api.repository.OtherReviewRepository;
import com.whiskeygallery_review.review_api.repository.WhiskeyReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class OtherReviewService extends BaseReviewService<OtherReview> {

    public OtherReviewService(OtherReviewRepository otherReviewRepository) {
        super(otherReviewRepository);
    }
}
