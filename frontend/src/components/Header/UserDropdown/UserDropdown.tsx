import React, { useContext } from 'react';

import { Dropdown, Skeleton } from 'antd';
import { auth } from '../../../util/auth';
import { client } from '../../../util/graph';
import { FiLogOut } from 'react-icons/fi';

import styles from './UserDropdown.module.scss';
import { DemoContext } from '../../../DemoContext';
import { useGetAdminQuery } from '../../../graph/generated/hooks';
import { AdminAvatar } from '../../Avatar/Avatar';

export const UserDropdown = () => {
    const { demo } = useContext(DemoContext);
    const {
        loading: a_loading,
        error: a_error,
        data: a_data,
    } = useGetAdminQuery({ skip: demo });

    console.log(a_data);

    const menu = (
        <div className={styles.dropdownMenu}>
            <div className={styles.dropdownInner}>
                {a_loading || a_error ? (
                    <Skeleton />
                ) : (
                    <>
                        <div className={styles.userInfoWrapper}>
                            <div className={styles.avatarWrapper}>
                                <AdminAvatar
                                    adminInfo={{
                                        name: a_data?.admin?.name,
                                        email: a_data?.admin?.email,
                                        photo_url: a_data?.admin?.photo_url,
                                    }}
                                    size={40}
                                />
                            </div>
                            <div className={styles.userCopy}>
                                <div className={styles.dropdownName}>
                                    {a_data?.admin?.name}
                                </div>
                                <div className={styles.dropdownEmail}>
                                    {a_data?.admin?.email}
                                </div>
                            </div>
                        </div>
                        <div
                            className={styles.dropdownLogout}
                            onClick={async () => {
                                try {
                                    auth.signOut();
                                } catch (e) {
                                    console.log(e);
                                }
                                client.cache.reset();
                            }}
                        >
                            <span className={styles.dropdownLogoutText}>
                                Logout
                            </span>
                            <FiLogOut className={styles.logoutIcon} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
    return (
        <Dropdown
            overlay={demo ? <></> : menu}
            placement={'bottomRight'}
            onVisibleChange={() => {
                window.analytics.track('User Icon Hover', {
                    foo: 'bar',
                    bar: 'foo',
                });
            }}
        >
            <div className={styles.accountIconWrapper}>
                {a_data?.admin ? (
                    <AdminAvatar adminInfo={a_data.admin} size={35} />
                ) : (
                    <p>loading</p>
                )}
            </div>
        </Dropdown>
    );
};
