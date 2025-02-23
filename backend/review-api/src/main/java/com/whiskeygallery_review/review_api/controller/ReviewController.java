package com.whiskeygallery_review.review_api.controller;
import com.whiskeygallery_review.review_api.dto.ReviewDto;
import com.whiskeygallery_review.review_api.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {
    @Autowired
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/other")
    public Page<ReviewDto> getOtherReviews(
            @RequestParam(required = false) List<String> andWords,
            @RequestParam(required = false) List<String> orWords,
            @RequestParam(required = false) String age,
            @RequestParam(required = false) String nickname,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "postDate") String sortField,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.valueOf(direction.toUpperCase());
        if(andWords!=null){
            System.out.println(String.join(", ", andWords));
        }

        return reviewService.searchOtherReviews(
                andWords, orWords, age, nickname,
                page, size, sortField, sortDirection).map(
                review->new ReviewDto(
                        review.getId(),
                        review.getTitle().trim(),
                        review.getRecom(),
                        review.getReply(),
                        review.getNickname(),
                        review.getPostDate(),
                        review.getCategory()
                )
        );
    }
    @GetMapping("/whiskey")
    public Page<ReviewDto> searchReviews(
            @RequestParam(required = false) List<String> andWords,
            @RequestParam(required = false) List<String> orWords,
            @RequestParam(required = false) String age,
            @RequestParam(required = false) String nickname,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "postDate") String sortField,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.valueOf(direction.toUpperCase());
        if(andWords!=null){
            System.out.println(String.join(", ", andWords));
        }

        return reviewService.searchWhiskeyReviews(
                andWords, orWords, age, nickname,
                page, size, sortField, sortDirection).map(
                        review->new ReviewDto(
                                review.getId(),
                                review.getTitle().trim(),
                                review.getRecom(),
                                review.getReply(),
                                review.getNickname(),
                                review.getPostDate(),
                                "whiskey"
                        )
        );
    }
}
