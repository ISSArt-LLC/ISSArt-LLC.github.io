import { FC } from "react";
import { Link } from "@mui/material";
import { useRouter } from "next/router";

const pages = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },  
];

const HeaderLinksList: FC<{ mobile?: boolean; local?: boolean }> = ({
  mobile,
  local,
}) => {
  const router = useRouter();

  const highlightActiveUrl = (path: string, idx: number) => {
    if (idx === 0) {
      return router.pathname === "/" ? "1px solid white" : "none";
    }
    return router.pathname.includes(path) ? "1px solid white" : "none";
  };

  return (
    <>
      {pages.map(({ name, path }, idx) => (
        <Link
          sx={{
            color: "white",
            paddingBottom: "4px",
            mr: 8,
            mb: mobile ? 2 : 0,
            borderBottom: highlightActiveUrl(path, idx),
            "&:last-child": { mr: 0 },
            "&:hover": {
              textDecoration: "none",
            },
          }}
          key={path}
          href={path}
        >
          {name}
        </Link>
      ))}
    </>
  );
};

export default HeaderLinksList;
