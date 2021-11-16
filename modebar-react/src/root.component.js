 export default function Root(props) {
  return (
  <div className="mode-bar">
    <nav>
        <ul className="deployment-menu">
            <li>
                <a className="view-map">
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#map-marker"></use> */}
                    </svg>
                    <translate>views.map</translate>
                </a>
            </li>

            <li>
                <a className="view-data">
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#list-rich"></use> */}
                    </svg>
                    <translate>views.data</translate>
                </a>
            </li>

            <li>
                <a>
                    <svg className="iconic" role="img">
                        {/* <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/iconic-sprite.svg#pulse"></use> */}
                    </svg>
                    <translate>views.activity</translate>
                </a>
            </li>

            <li>
                <button className="more-menu-trigger">
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#ellipses"></use> */}
                    </svg>
                    <translate>nav.more</translate>
                </button>
                <ul>
                    <li>
                        <a>
                            <svg className="iconic" role="img">
                                {/* <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/iconic-sprite.svg#cog"></use> */}
                            </svg>
                            <translate>nav.settings</translate>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>

        <ul className="account-menu">
            <li>
                <button>
                    <svg className="iconic">
                        {/* <use xlink:href="/img/iconic-sprite.svg#grid-three-up"></use> */}
                    </svg>
                    <span className="label" translate>nav.collections</span>
                </button>
            </li>

            <li>
                <button>
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#account-login"></use> */}
                    </svg>
                    <translate translate="nav.login">Log in</translate>
                </button>
            </li>

            <li>
                <button>
                    <img className="avatar" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro" alt="account_settings"/>
                    <span className="label" translate="nav.account_settings">Account Settings</span>
                </button>
            </li>

            <li>
                <button >
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#person"></use> */}
                    </svg>
                    <translate translate="nav.register">Sign up</translate>
                </button>
            </li>

            <li>
                <button>
                    <svg className="iconic" role="img">
                        {/* <use xlink:href="/img/iconic-sprite.svg#account-logout"></use> */}
                    </svg>
                    <span className="label" translate="nav.logout">Log out</span>
                </button>
            </li>

            <li>
                <button>
                    <span className="label" translate>app.support</span>
                </button>
            </li>
        </ul>
    </nav>
</div>
  );
}
