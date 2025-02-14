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
    public List<ReviewDTO> getWhiskeyReviews() {
        return reviewService.getWhiskeyReviews();
    }

    @GetMapping("/other")
    public List<ReviewDTO> getOtherReviews() {
        return reviewService.getOtherReviews();
    }
}
