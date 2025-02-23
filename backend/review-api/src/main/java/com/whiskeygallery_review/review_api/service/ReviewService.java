package com.whiskeygallery_review.review_api.service;
import com.whiskeygallery_review.review_api.dto.ReviewDto;
import com.whiskeygallery_review.review_api.entity.OtherReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import com.whiskeygallery_review.review_api.repository.OtherReviewRepository;
import com.whiskeygallery_review.review_api.repository.WhiskeyReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private final WhiskeyReviewRepository whiskeyReviewRepository;
    private final OtherReviewRepository otherReviewRepository;

    public ReviewService(WhiskeyReviewRepository whiskeyReviewRepository, OtherReviewRepository otherReviewRepository) {
        this.whiskeyReviewRepository = whiskeyReviewRepository;
        this.otherReviewRepository = otherReviewRepository;
    }

    public List<ReviewDto> getWhiskeyReviews() {
        return whiskeyReviewRepository.findAll().stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getOtherReviews() {
        return otherReviewRepository.findAll().stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }

    public Page<WhiskeyReview> searchWhiskeyReviews(
            List<String> andWords,
            List<String> orWords,
            String age,
            String nickname,
            int page,
            int size,
            String sortField,
            Sort.Direction direction) {

        Sort sort = Sort.by(direction, sortField);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return whiskeyReviewRepository.searchWithPaging(
                andWords, orWords, age, nickname, pageRequest);
    }

    public Page<OtherReview> searchOtherReviews(
            List<String> andWords,
            List<String> orWords,
            String age,
            String nickname,
            int page,
            int size,
            String sortField,
            Sort.Direction direction) {

        Sort sort = Sort.by(direction, sortField);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return otherReviewRepository.searchWithPaging(
                andWords, orWords, age, nickname, pageRequest);
    }
}

