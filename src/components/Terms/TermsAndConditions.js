import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderDark from "../../views/header/HeaderDark";
import Footer from "../../views/Footer/Footer";

const TermsAndConditions = ({ title, header, footer, acceptBtn }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {header ? header : <HeaderDark />}
            <div className="container mb-5" style={{ marginTop: "100px" }}>
                <div className="row mt-5 mb-5">
                    <div className="col">
                        {acceptBtn ? (
                            acceptBtn
                        ) : (
                            <h3 className="blue-text">{title ? title : "Terms and Conditions"}</h3>
                        )}
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12">
                        <h3>
                            <strong>WHO WE ARE AND HOW TO CONTACT US</strong>
                        </h3>

                        <p>
                            <strong className="mr-1">
                                <a
                                    href="http://www.loopcycle.io"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    www.loopcycle.io
                                </a>
                            </strong>
                            is a site operated by Loop Infinity Ltd ("<strong>We</strong>" or “{" "}
                            <strong>Loopcycle</strong>”). We are registered in England and Wales
                            under company number 11456617 and have our registered office and main
                            trading address.
                        </p>
                        <p>
                            We operate a business-to-business marketplace which uses artificial
                            intelligence to trace the circulation of products between end users and
                            product manufacturers, based on the information submitted by both
                            parties.
                        </p>
                        <p>
                            To contact us, please email{" "}
                            <a href="mailto:hello@loopcycle.io">hello@loopcycle.io</a>.
                        </p>
                        <h4>
                            <strong>BY USING OUR SITE YOU ACCEPT THESE TERMS</strong>
                        </h4>
                        <p>
                            By using our site, you confirm that you accept these terms of use and
                            that you agree to comply with them.
                        </p>
                        <p>If you do not agree to these terms, you must not use our site.</p>
                        <p>
                            We recommend that you print a copy of these terms for future reference.
                        </p>
                        <h4>
                            <strong>THERE ARE OTHER TERMS THAT MAY APPLY TO YOU</strong>
                        </h4>
                        <p>
                            These terms of use refer to the following additional terms, which also
                            apply to your use of our site:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    Our{" "}
                                    <Link to="/privacy">
                                        <u>Privacy Policy</u>
                                    </Link>
                                    .
                                </p>
                            </li>
                            <li>
                                <p>
                                    Our{" "}
                                    <Link to="/acceptable">
                                        <u>Acceptable Use Policy</u>
                                    </Link>
                                    , which sets out the permitted uses and prohibited uses of our
                                    site. When using our site, you must comply with this{" "}
                                    <Link to="/acceptable">
                                        <u>Acceptable Use Policy</u>
                                    </Link>
                                    .
                                </p>
                            </li>
                            <li>
                                <p>
                                    Our{" "}
                                    <Link to="/cookie">
                                        <u>Cookie Policy</u>
                                    </Link>
                                    , which sets out information about the cookies on our site.
                                </p>
                            </li>
                        </ul>
                        <p>
                            If you purchase goods from our site, our Terms and conditions of supply
                            will apply to the sales.
                        </p>
                        <h4>
                            <strong>WE MAY MAKE CHANGES TO THESE TERMS</strong>
                        </h4>
                        <p>
                            We amend these terms from time to time. Every time you wish to use our
                            site, please check these terms to ensure you understand the terms that
                            apply at that time.
                        </p>
                        <h4>
                            <strong>WE MAY MAKE CHANGES TO OUR SITE</strong>
                        </h4>
                        <p>
                            We may update and change our site from time to time to reflect changes
                            to our users' needs and our business priorities.
                        </p>
                        <h4>
                            <strong>WE MAY SUSPEND OR WITHDRAW OUR SITE</strong>
                        </h4>
                        <p>Our site is made available free of charge.</p>
                        <p>
                            We do not guarantee that our site, or any content on it, will always be
                            available or be uninterrupted. We may suspend or withdraw or restrict
                            the availability of all or any part of our site for business and
                            operational reasons. We will try to give you reasonable notice of any
                            suspension or withdrawal.
                        </p>
                        <p>
                            You are also responsible for ensuring that all persons who access our
                            site through your internet connection are aware of these terms of use
                            and other applicable terms and conditions, and that they comply with
                            them.
                        </p>
                        <h4>
                            <strong>WE MAY TRANSFER THIS AGREEMENT TO SOMEONE ELSE</strong>
                        </h4>
                        <p>
                            We may transfer our rights and obligations under these terms to another
                            organisation. We will always tell you in writing if this happens and we
                            will ensure that the transfer will not affect your rights under the
                            contract.
                        </p>
                        <p>
                            <strong>OUR SITE IS ONLY FOR USERS IN THE UK</strong>
                        </p>
                        <p>
                            Our site is directed to people residing in the United Kingdom. We do not
                            represent that content available on or through our site is appropriate
                            for use or available in other locations.
                        </p>
                        <h4>
                            <strong>YOU MUST KEEP YOUR ACCOUNT DETAILS SAFE</strong>
                        </h4>
                        <p>
                            If you choose, or you are provided with, a user identification code,
                            password or any other piece of information as part of our security
                            procedures, you must treat such information as confidential. You must
                            not disclose it to any third party.
                        </p>
                        <p>
                            We have the right to disable any user identification code or password,
                            whether chosen by you or allocated by us, at any time, if in our
                            reasonable opinion you have failed to comply with any of the provisions
                            of these terms of use.
                        </p>
                        <p>
                            If you know or suspect that anyone other than you knows your user
                            identification code or password, you must promptly notify us at
                            <a href="mailto:hello@loopcycle.io">hello@loopcycle.io</a>.
                        </p>
                        <p>
                            <strong>HOW YOU MAY USE MATERIAL ON OUR SITE</strong>
                        </p>
                        <p>
                            We are the owner or the licensee of all intellectual property rights in
                            our site, and in the material published on it. Those works are protected
                            by copyright laws and treaties around the world. All such rights are
                            reserved.
                        </p>
                        <p>
                            You may print off one copy, and may download extracts, of any page(s)
                            from our site for your personal use and you may draw the attention of
                            others within your organisation to content posted on our site.
                        </p>
                        <p>
                            You must not modify the paper or digital copies of any materials you
                            have printed off or downloaded in any way, and you must not use any
                            illustrations, photographs, video or audio sequences or any graphics
                            separately from any accompanying text.
                        </p>
                        <p>
                            Our status (and that of any identified contributors) as the authors of
                            content on our site must always be acknowledged.
                        </p>
                        <p>
                            You must not use any part of the content on our site for commercial
                            purposes without obtaining a licence to do so from us or our licensors.
                        </p>
                        <p>
                            If you print off, copy or download any part of our site in breach of
                            these terms of use, your right to use our site will cease immediately
                            and you must, at our option, return or destroy any copies of the
                            materials you have made.
                        </p>
                        <h4>
                            <strong>DO NOT RELY ON INFORMATION ON THIS SITE</strong>
                        </h4>
                        <p>
                            The content on our site is provided for general information only. It is
                            not intended to amount to advice on which you should rely. You must
                            obtain professional or specialist advice before taking, or refraining
                            from, any action on the basis of the content on our site.
                        </p>
                        <p>
                            Although we make reasonable efforts to update the information on our
                            site, we make no representations, warranties or guarantees, whether
                            express or implied, that the content on our site is accurate, complete
                            or up to date.
                        </p>
                        <h4>
                            <strong>WE ARE NOT RESPONSIBLE FOR WEBSITES WE LINK TO</strong>
                        </h4>
                        <p>
                            Where our site contains links to other sites and resources provided by
                            third parties, these links are provided for your information only. Such
                            links should not be interpreted as approval by us of those linked
                            websites or information you may obtain from them.
                        </p>
                        <p>We have no control over the contents of those sites or resources.</p>
                        <h4>
                            <strong>USER-GENERATED CONTENT IS NOT APPROVED BY US</strong>
                        </h4>
                        <p>
                            This website may include information and materials uploaded by other
                            users of the site, including to bulletin boards and chat rooms. This
                            information and these materials have not been verified or approved by
                            us. The views expressed by other users on our site do not represent our
                            views or values.
                        </p>
                        <h4>
                            <strong>HOW TO COMPLAIN ABOUT CONTENT UPLOADED BY OTHER USERS</strong>
                        </h4>
                        <p>
                            If you wish to complain about content uploaded by other users, please
                            contact us on <a href="mailto:hello@loopcycle.io">hello@loopcycle.io</a>
                            .
                        </p>
                        <h4>
                            <strong>OUR RESPONSIBILITY FOR LOSS OR DAMAGE SUFFERED BY YOU</strong>
                        </h4>
                        <p>
                            We do not exclude or limit in any way our liability to you where it
                            would be unlawful to do so. This includes liability for death or
                            personal injury caused by our negligence or the negligence of our
                            employees, agents or subcontractors and for fraud or fraudulent
                            misrepresentation.
                        </p>
                        <p>
                            Different limitations and exclusions of liability will apply to
                            liability arising as a result of the supply of any products to you,
                            which will be set out in our Terms and conditions of supply.
                        </p>
                        <p>
                            We exclude all implied conditions, warranties, representations or other
                            terms that may apply to our site or any content on it.
                        </p>
                        <p>
                            We will not be liable to you for any loss or damage, whether in
                            contract, tort (including negligence), breach of statutory duty, or
                            otherwise, even if foreseeable, arising under or in connection with:
                        </p>
                        <ul>
                            <li>
                                <p>use of, or inability to use, our site; or</p>
                            </li>
                            <li>
                                <p>use of or reliance on any content displayed on our site.</p>
                            </li>
                        </ul>
                        <p>In particular, we will not be liable for:</p>
                        <ul>
                            <li>
                                <p>loss of profits, sales, business, or revenue;</p>
                            </li>
                            <li>
                                <p>business interruption;</p>
                            </li>
                            <li>
                                <p>loss of anticipated savings;</p>
                            </li>
                            <li>
                                <p>loss of business opportunity, goodwill or reputation; or</p>
                            </li>
                            <li>
                                <p>any indirect or consequential loss or damage.</p>
                            </li>
                        </ul>
                        <h4>
                            <strong>HOW WE MAY USE YOUR PERSONAL INFORMATION</strong>
                        </h4>
                        <p>
                            We will only use your personal information as set out in our Privacy
                            Policy.
                        </p>
                        <h4>
                            <strong>UPLOADING CONTENT TO OUR SITE</strong>
                        </h4>
                        <p>
                            Whenever you make use of a feature that allows you to upload content to
                            our site, or to make contact with other users of our site, you must
                            comply with the content standards set out in our Acceptable Use Policy .
                        </p>
                        <p>
                            You warrant that any such contribution does comply with those standards,
                            and you will be liable to us and indemnify us for any breach of that
                            warranty. This means you will be responsible for any loss or damage we
                            suffer as a result of your breach of warranty.
                        </p>
                        <p>
                            Any content you upload to our site will be considered non-confidential
                            and non-proprietary. You retain all of your ownership rights in your
                            content, but you are required to grant us and other users of our site a
                            limited licence to use, store and copy that content and to distribute
                            and make it available to third parties. The rights you license to us are
                            described further down in
                            <em>Rights you are giving us to use material you upload</em>.
                        </p>
                        <p>
                            We also have the right to disclose your identity to any third party who
                            is claiming that any content posted or uploaded by you to our site
                            constitutes a violation of their intellectual property rights, or of
                            their right to privacy.
                        </p>
                        <p>
                            We have the right to remove any posting you make on our site if, in our
                            opinion, your post does not comply with the content standards set out in
                            our Acceptable Use Policy .
                        </p>
                        <p>You are solely responsible for securing and backing up your content.</p>
                        <p>We do not store terrorist content.</p>
                        <h4>
                            <strong>RIGHTS YOU ARE GIVING US TO USE MATERIAL YOU UPLOAD</strong>
                        </h4>
                        <p>
                            When you upload or post content to our site, you grant us the following
                            rights to use that content:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    To process and publish your content within the marketplace in
                                    order to create a suitable transaction
                                </p>
                            </li>
                            <li>
                                <p>
                                    To process, publish and present relevant data in an anonymised
                                    way for industry-and sector-level insight.
                                </p>
                            </li>
                            <li>
                                <p>
                                    To allow external third parties to publish and present
                                    anonymised data provided by Loopcycle on industry-and
                                    sector-level insight.
                                </p>
                            </li>
                            <li>
                                <p>
                                    To promote the benefits of the Loopcycle platform to our target
                                    industries and sectors.
                                </p>
                            </li>
                            <li>
                                <p>
                                    For general promotion activities within the Loopcycle platform.
                                </p>
                            </li>
                        </ul>
                        <h4>
                            <strong>
                                WE ARE NOT RESPONSIBLE FOR VIRUSES AND YOU MUST NOT INTRODUCE THEM
                            </strong>
                        </h4>
                        <p>
                            We do not guarantee that our site will be secure or free from bugs or
                            viruses.
                        </p>
                        <p>
                            You are responsible for configuring your information technology,
                            computer programmes and platform to access our site. You should use your
                            own virus protection software.
                        </p>
                        <p>
                            You must not misuse our site by knowingly introducing viruses, trojans,
                            worms, logic bombs or other material that is malicious or
                            technologically harmful. You must not attempt to gain unauthorised
                            access to our site, the server on which our site is stored or any
                            server, computer or database connected to our site. You must not attack
                            our site via a denial-of-service attack or a distributed denial-of
                            service attack. By breaching this provision, you would commit a criminal
                            offence under the Computer Misuse Act 1990. We will report any such
                            breach to the relevant law enforcement authorities and we will
                            co-operate with those authorities by disclosing your identity to them.
                            In the event of such a breach, your right to use our site will cease
                            immediately.
                        </p>
                        <h4>
                            <strong>RULES ABOUT LINKING TO OUR SITE</strong>
                        </h4>
                        <p>
                            You may link to our home page, provided you do so in a way that is fair
                            and legal and does not damage our reputation or take advantage of it.
                        </p>
                        <p>
                            You must not establish a link in such a way as to suggest any form of
                            association, approval or endorsement on our part where none exists.
                        </p>
                        <p>
                            You must not establish a link to our site in any website that is not
                            owned by you.
                        </p>
                        <p>
                            Our site must not be framed on any other site, nor may you create a link
                            to any part of our site other than the home page.
                        </p>
                        <p>We reserve the right to withdraw linking permission without notice.</p>
                        <p>
                            The website in which you are linking must comply in all respects with
                            the content standards set out in our Acceptable Use Policy .
                        </p>
                        <p>
                            If you wish to link to or make any use of content on our site other than
                            that set out above, please contact{" "}
                            <a href="mailto:hello@loopcycle.io">hello@loopcycle.io</a>.
                        </p>
                        <h4>
                            <strong>WHICH COUNTRY'S LAWS APPLY TO ANY DISPUTES?</strong>
                        </h4>
                        <p>
                            If you are a consumer, please note that these terms of use, their
                            subject matter and their formation, are governed by English law. You and
                            we both agree that the courts of England and Wales will have exclusive
                            jurisdiction except that if you are a resident of Northern Ireland you
                            may also bring proceedings in Northern Ireland, and if you are resident
                            of Scotland, you may also bring proceedings in Scotland.
                        </p>
                        <p>
                            If you are a business, these terms of use, their subject matter and
                            their formation (and any non-contractual disputes or claims) are
                            governed by English law. We both agree to the exclusive jurisdiction of
                            the courts of England and Wales.
                        </p>
                        <p>
                            <strong>OUR TRADEMARKS ARE REGISTERED</strong>
                        </p>
                        <p>
                            "Loopcycle" is a UK registered trademark of Loop Infinity Ltd. You are
                            not permitted to use them without our approval, unless they are part of
                            material you are using as permitted above under
                            <em>How you may use material on our site</em>.
                        </p>
                    </div>
                </div>
            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default TermsAndConditions;
