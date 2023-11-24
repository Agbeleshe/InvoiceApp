import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "../../../design-system";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { RouteNames } from "../../../routers/interface";

function SideBar() {
  const TAB_LIST = [
    {
      id: 1,
      icon: faUser,
      label: "Dashboard",
      path: RouteNames.DASHBOARD,
    },
    {
      id: 2,
      icon: faUser,
      label: "Invoice",
      path: RouteNames.INVOICE,
    },
    {
      id: 3,
      icon: faUser,
      label: "Clients",
      path: RouteNames.CLIENT,
    },
  ];

  const { pathname } = useLocation();

  const index = pathname.split("/")[0];

  const isActive = (itemPath: string) =>
    pathname.split("/")[1] === itemPath.split("/")[1];

  return (
    <div className="flex justify-between flex-col min-h-screen bg-white border-r border-color-gray px-5 py-6 min-w-[260px]">
      <div>
        {TAB_LIST.map((item) => (
          <ListItem
            key={item.id}
            {...item}
            path={`${index}${item.path}`}
            active={isActive(item.path)}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default SideBar;

interface IListItemProps {
  label: string;
  path: string;
  icon: IconProp;
  active: boolean;
}

function ListItem({ label, path, icon, active }: IListItemProps) {
  return (
    <Link to={path}>
      <div
        className={classNames(
          "flex justify-start mt-2 !items-center gap-[14px] h-[52px] px-4 py-3 hover:bg-color-gray",
          "rounded-lg text-gray-400",
          {
            ["!bg-color-primary !text-color-white"]: active,
          }
        )}
      >
        <FontAwesomeIcon icon={icon} />
        <Typography
          fontWeight={active ? 600 : 400}
          variant={"body3"}
          color={active ? "white" : "gray.400"}
        >
          {label}
        </Typography>
      </div>
    </Link>
  );
}
