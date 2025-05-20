package com.whiskeygallery_review.review_api.service;

import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import com.whiskeygallery_review.review_api.repository.WhiskeyReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class WhiskeyReviewService extends BaseReviewService<WhiskeyReview> {

    public WhiskeyReviewService(WhiskeyReviewRepository whiskeyReviewRepository) {
        super(whiskeyReviewRepository);
    }
}
