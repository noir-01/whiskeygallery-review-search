import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import type { DropDownOptionProps } from "@/types/review";

const DropDownOption = ({
  optionList,
  ...selectProps
}: DropDownOptionProps) => (
  <Select
    variant="standard"
    {...selectProps}
    input={<InputBase />}
    MenuProps={{
      PaperProps: { sx: { borderRadius: 1 } },
      MenuListProps: { sx: { padding: 0, maxHeight: "400px" } },
    }}
  >
    {optionList.map((item, idx) => (
      <MenuItem
        key={item.value}
        value={item.value}
        divider={idx !== optionList.length - 1}
        sx={{ height: "40px", minHeight: 0, px: 1 }}
      >
        <Typography variant="subtitle2" sx={{ pl: 1, fontWeight: 700 }}>
          {item.content}
        </Typography>
      </MenuItem>
    ))}
  </Select>
);

export default DropDownOption;
