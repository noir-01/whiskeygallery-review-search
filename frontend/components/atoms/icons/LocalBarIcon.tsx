import { SvgIcon, SvgIconProps } from "@mui/material";

const LocalBarIcon = ({ ...props }: SvgIconProps) => (
  <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7 5.66 5h12.69l-1.78 2H7.43z"></path>
  </SvgIcon>
);

export default LocalBarIcon;
