import lombok.Getter;
import java.time.LocalDate;

@Getter
public class ReviewDTO {
    private Integer id;
    private String title;
    private Integer recommend;
    private Integer reply;
    private String nickname;
    private LocalDate time;
    private String category;

    public ReviewDTO(WhiskeyReview review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.recommend = review.getRecom();
        this.reply = review.getReply();
        this.nickname = review.getNickname();
        this.time = review.getTime();
        this.category = "whiskey";
    }

    public ReviewDTO(OtherReview review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.recommend = review.getRecom();
        this.reply = review.getReply();
        this.nickname = review.getNickname();
        this.time = review.getTime();
        this.category = review.getCategory();
    }
}
