import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "otherReview")
public class OtherReview extends BaseReview {
    private String category;
}
