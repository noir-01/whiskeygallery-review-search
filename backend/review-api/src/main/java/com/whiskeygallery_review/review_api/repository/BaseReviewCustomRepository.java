package com.whiskeygallery_review.review_api.repository;

import com.whiskeygallery_review.review_api.entity.BaseReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BaseReviewCustomRepository<T extends BaseReview> {

    Page<T> searchWithPaging(List<String> andWords, List<String> orWords, String age, String nickname, Pageable pageable);
}

