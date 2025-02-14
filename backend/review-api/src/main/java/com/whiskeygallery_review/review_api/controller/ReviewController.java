package com.whiskeygallery_review.review_api.controller;
import com.whiskeygallery_review.review_api.dto.ReviewDto;
import com.whiskeygallery_review.review_api.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/whiskey")
    public List<ReviewDto> getWhiskeyReviews() {
        return reviewService.getWhiskeyReviews();
    }

    @GetMapping("/other")
    public List<ReviewDto> getOtherReviews() {
        return reviewService.getOtherReviews();
    }
}
