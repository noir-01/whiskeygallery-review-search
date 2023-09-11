import { Typography } from "@mui/material";

const ChangeFormattedText = ({ multiLineText }: { multiLineText: string }) => (
  <>
    {multiLineText.split("\n").map((line, index) => (
      <Typography
        key={index}
        variant="body2"
        sx={{ fontSize: { xs: "12px", sm: "auto" } }}
      >
        {line}
        {index !== multiLineText.length - 1 && <br />}{" "}
      </Typography>
    ))}
  </>
);

export default ChangeFormattedText;
