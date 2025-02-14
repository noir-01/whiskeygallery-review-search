package com.whiskeygallery_review.review_api.service;
import com.whiskeygallery_review.review_api.dto.ReviewDto;
import com.whiskeygallery_review.review_api.repository.OtherReviewRepository;
import com.whiskeygallery_review.review_api.repository.WhiskeyReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
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
}
