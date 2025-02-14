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

    public List<ReviewDTO> getWhiskeyReviews() {
        return whiskeyReviewRepository.findAll().stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getOtherReviews() {
        return otherReviewRepository.findAll().stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }
}
