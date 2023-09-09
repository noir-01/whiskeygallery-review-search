import { SvgIcon, SvgIconProps } from "@mui/material";

const DownloadIcon = ({ ...props }: SvgIconProps) => (
  <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>
  </SvgIcon>
);

export default DownloadIcon;