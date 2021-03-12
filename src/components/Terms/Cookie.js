import React, {useEffect} from "react";
import HeaderDark from "../../views/header/HeaderDark";
import Footer from "../../views/Footer/Footer";

const Cookie = ({title,  header, footer }) => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            {header ? header : <HeaderDark />}
            <div className="container mb-5" style={{ marginTop: "100px" }}>
                <div className="row mt-5 mb-5">
                    <div className="col">
                        <h3 className="blue-text">{title ? title : "Cookie Policy"}</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <h4 align="center">
                            <strong>Cookie Policy</strong>
                        </h4>
                        <p align="justify">
                            Our website uses cookies to distinguish you from other users of our
                            website. This helps us to provide you with a good experience when you
                            browse our website and also allows us to improve our site.
                        </p>
                        <p align="justify">
                            A cookie is a small file of letters and numbers that we store on your
                            browser or the hard drive of your computer if you agree. Cookies contain
                            information that is transferred to your computer's hard drive.
                        </p>
                        <p align="justify">We use the following cookies:</p>
                        <ul>
                            <li>
                                <p align="justify">
                                    <strong>Strictly necessary cookies.</strong>
                                    These are cookies that are required for the operation of our
                                    website. They include, for example, cookies that enable you to
                                    log into secure areas of our website.
                                </p>
                            </li>
                            <li>
                                <p align="justify">
                                    <strong>Analytical or performance cookies.</strong>
                                    These allow us to recognise and count the number of visitors and
                                    to see how visitors move around our website when they are using
                                    it. This helps us to improve the way our website works, for
                                    example, by ensuring that users are finding what they are
                                    looking for easily.
                                </p>
                            </li>
                            <li>
                                <p align="justify">
                                    <strong>Functionality cookies.</strong>
                                    These are used to recognise you when you return to our website.
                                    This enables us to personalise our content for you, greet you by
                                    name and remember your preferences (for example, your choice of
                                    language or region).
                                </p>
                            </li>
                            <li>
                                <p align="justify">
                                    <strong>Targeting cookies.</strong>
                                    These cookies record your visit to our website, the pages you
                                    have visited and the links you have followed. We will use this
                                    information to make our website and the advertising displayed on
                                    it more relevant to your interests. We may also share this
                                    information with third parties for this purpose.
                                </p>
                            </li>
                        </ul>
                        <p align="justify">
                            We do not share the information collected by the cookies with any third
                            parties.
                        </p>
                        <p align="justify">
                            We may modify this Cookie policy from time to time. We will use
                            reasonable endeavours to notify you of any material amendments to this
                            Cookie policy by placing a clear notice about it on the website or by
                            other means, but do not guarantee to do so. By using this website and in
                            consideration for us permitting you to use the website, you agree to be
                            bound by the Cookie policy as modified from time to time.
                        </p>
                        <p align="justify">
                            You can block cookies by activating the setting on your browser that
                            allows you to refuse the setting of all or some cookies. However, if you
                            use your browser settings to block all cookies (including essential
                            cookies) you may not be able to access all or parts of our website.
                        </p>
                        <p align="justify">
                            Except for essential cookies, all cookies will expire after the browser
                            is closed.
                        </p>
                    </div>
                </div>


            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default Cookie;
