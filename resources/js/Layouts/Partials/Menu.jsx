import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react"; // jangan lupa icon
import { route } from "ziggy-js";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRole } from "../../src/hook/useRole";

export default function Menu({ ...props }) {
    const isActive = (namedRoute) => route().current(namedRoute) ? "active-page" : "";
    const isDropDownActive = (namedRoute) => route().current(namedRoute) ? "open" : "";
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const { url } = usePage()
    const { hasAnyRole, roles } = useRole();
    useEffect(() => {
        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll("a[data-route]");
                submenuLinks.forEach((link) => {
                    const namedRoute = link.dataset.route;
                    if (namedRoute && route().current(namedRoute)) {
                        dropdown.classList.add("open");
                        const submenu = dropdown.querySelector(".sidebar-submenu");
                        if (submenu) {
                            submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                        }
                    }
                });
            });
        };

        openActiveDropdown();
    }, [url]);
    return (
        <ul className='sidebar-menu' id='sidebar-menu'>

            <li className="mb-16">
                <Link href={route('dashboard')} className={isActive('dashboard')}>
                    <Icon icon='mdi:home' className='menu-icon' />
                    <span>{t('Dashboard')}</span>
                </Link>
            </li>
            {(hasAnyRole(['Administrator', 'Superadmin'])) && (
                <>
                    <li className='sidebar-menu-group-title'>{t('Master Data')}</li>
                    <li>
                        <Link href={route('master-data.employees.index')} className={isActive('master-data.employees.*') || isActive('trash.employees') || isActive('profile.*')}>
                            <Icon icon='mdi:user' className='menu-icon' />
                            <span>{t('Employees')}</span>
                        </Link>

                    </li>
                    <li>
                        <Link href={route('master-data.positions.index')} className={isActive('master-data.positions.*') || isActive('trash.positions')}>
                            <Icon icon='mdi:user-tie' className='menu-icon' />
                            <span>{t('Positions')}</span>
                        </Link>
                    </li>

                </>
            )
            }



            {hasAnyRole(['Administrator', 'Superadmin']) && (
                <>
                    <li className='sidebar-menu-group-title'>{t('Other')}</li>
                    <li>
                        <Link href={route('employee-assigments.index')} className={isActive('employee-assigments.*')}>
                            <Icon icon='mdi:account-switch' className='menu-icon' />
                            <span>{t('PLH / PLT')}</span>
                        </Link>
                    </li>
                    <li className="dropdown">
                        <Link href="#" className={isActive('report.*')}>
                            <Icon icon='mdi:file-export' className='menu-icon' />
                            <span>{t('Reports')}</span>
                        </Link>
                        <ul className='sidebar-submenu'>
                            <li>
                                <Link href={route('report.employees.index')} className={isActive('report.employees.*')}>
                                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                                    <span>{t('Employee')}</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {/* {hasAnyRole(['Admin']) && (
                        <li>
                            <Link href={route('settings.index')} className={isActive('settings.*')}>
                                <Icon icon='mdi:settings' className='menu-icon' />
                                <span>{t('Settings')}</span>
                            </Link>
                        </li>

                    )} */}
                </>
            )}

        </ul >
    );
}
