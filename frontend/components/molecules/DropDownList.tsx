import { useMemo } from "react";
import { Box, List, ListItemButton, Typography } from "@mui/material";

const DropDownList = ({
  open,
  title,
  selectedList,
  list,
  addElement,
}: {
  open: boolean;
  title: string;
  selectedList: { name: string; value: number }[];
  list: () => { value: string }[];
  addElement: (name: string, value: number) => void;
}) => {
  const nameList = useMemo(
    () => selectedList.map((item) => item.name),
    [selectedList]
  );

  return (
    <Box
      sx={{
        backgroundColor: "#F2EDD7",
        p: 0.5,
        pb: 0,
        borderRadius: 2,
        mb: "8px",
      }}
    >
      <Typography
        sx={{ fontSize: { xs: "12px", sm: "16px" }, fontWeight: 700, pl: 1 }}
      >
        {title}
      </Typography>
      <List
        component="div"
        sx={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 0.7,
        }}
      >
        {[...list()].map((item, idx) => (
          <ListItemButton
            key={idx}
            sx={{
              p: 0.5,
              height: { xs: "20px", sm: "24px" },
              minWidth: { xs: "56px", sm: "72px" },
              maxWidth: { xs: "56px", sm: "72px" },
              backgroundColor: nameList.includes(item.value)
                ? "#755139"
                : "white",
              color: nameList.includes(item.value) ? "#ffffff" : "black",
              borderRadius: 4,
              ":hover": {
                backgroundColor: nameList.includes(item.value)
                  ? "#755139"
                  : "white",
              },
            }}
            onClick={() => addElement(item.value, 3)}
          >
            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "12px" },
                mx: "auto",
                fontWeight: nameList.includes(item.value) ? 700 : 500,
              }}
            >
              {item.value}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default DropDownList;
