import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "whiskeyReview")
public class WhiskeyReview extends BaseReview {
}
