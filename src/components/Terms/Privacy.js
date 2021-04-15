import React, { useEffect } from "react";
import Footer from "../../views/Footer/Footer";
import HeaderDark from "../../views/header/HeaderDark";

const Privacy = ({ title, header, footer }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {header ? header : <HeaderDark />}
            <div className="container mb-5" style={{ marginTop: "100px" }}>
                <div className="row mt-5 mb-5">
                    <div className="col">
                        <h3 className="blue-text">{title ? title : "Privacy Policy"}</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <h3 align="center">
                            <strong>PRIVACY POLICY</strong>
                        </h3>
                        <h4>
                            <strong>INTRODUCTION</strong>
                        </h4>
                        <p>Welcome to our privacy policy.</p>
                        <p>
                            Loop Infinity Ltd respects your privacy and is committed to protecting
                            your personal data. This privacy policy will inform you as to how we
                            look after your personal data when you visit our website (regardless of
                            where you visit it from) and tell you about your privacy rights and how
                            the law protects you.
                        </p>
                        <p>
                            This privacy policy is provided in a layered format so you can click
                            through to the specific areas set out below. Please also use the
                            Glossary to understand the meaning of some of the terms used in this
                            privacy policy.
                        </p>
                        <ol>
                            <li>
                                <h4>Important information and who we are</h4>
                            </li>
                        </ol>
                        <h4>
                            <strong>Purpose of this privacy policy</strong>
                        </h4>
                        <p>
                            This privacy policy aims to give you information on how Loop Infinity
                            Ltd collects and processes your personal data through your use of this
                            website, including any data you may provide through this website when
                            you purchase a product or service.
                        </p>
                        <p>
                            This website is not intended for children and we do not knowingly
                            collect data relating to children.
                        </p>
                        <p>
                            It is important that you read this privacy policy together with any
                            other privacy policy or fair processing policy we may provide on
                            specific occasions when we are collecting or processing personal data
                            about you so that you are fully aware of how and why we are using your
                            data. This privacy policy supplements other notices and privacy policies
                            and is not intended to override them.
                        </p>
                        <h4>
                            <strong>Controller</strong>
                        </h4>
                        <p>
                            Loop Infinity Ltd is the controller and responsible for your personal
                            data (collectively referred to as "we", "us" or "our" in this privacy
                            policy).
                        </p>
                        <p>
                            We have appointed a Product Manager who is responsible for overseeing
                            questions in relation to this privacy policy. If you have any questions
                            about this privacy policy, including any requests to exercise{" "}
                            <em>your legal rights</em>, please contact the Product Manager using the
                            details set out below.
                        </p>
                        <h4>
                            <strong>Contact details</strong>
                        </h4>
                        <p>
                            If you have any questions about this privacy policy or our privacy
                            practices, please contact us in the following ways:
                        </p>
                        <p>Full name of legal entity: Loop Infinity Ltd</p>
                        <p>
                            Reference (to be quoted in the subject heading): Loopcycle Privacy
                            Policy
                        </p>
                        <p>
                            Email address:{" "}
                            <a href="mailto:hello@loopcycle.io">hello@loopcycle.io</a>
                        </p>
                        <p>Postal address: Camden Collective, 5-7 Buck Street, London NW1 8NJ</p>
                        <p>
                            You have the right to make a complaint at any time to the Information
                            Commissioner's Office (ICO), the UK supervisory authority for data
                            protection issues (<em>www.ico.org.uk</em>). We would, however,
                            appreciate the chance to deal with your concerns before you approach the
                            ICO so please contact us in the first instance.
                        </p>
                        <p>
                            <strong>
                                Changes to the privacy policy and your duty to inform us of changes
                            </strong>
                        </p>
                        <p>We keep our privacy policy under regular review.</p>
                        <p>
                            It is important that the personal data we hold about you is accurate and
                            current. Please keep us informed if your personal data changes during
                            your relationship with us.
                        </p>
                        <h4>
                            <strong>Third-party links</strong>
                        </h4>
                        <p>
                            This website may include links to third-party websites, plug-ins and
                            applications. Clicking on those links or enabling those connections may
                            allow third parties to collect or share data about you. We do not
                            control these third-party websites and are not responsible for their
                            privacy statements. When you leave our website, we encourage you to read
                            the privacy policy of every website you visit.
                        </p>
                        <ol start="2">
                            <li>
                                <p>The data we collect about you</p>
                            </li>
                        </ol>
                        <p>
                            Personal data, or personal information, means any information about an
                            individual from which that person can be identified. It does not include
                            data where the identity has been removed (anonymous data).
                        </p>
                        <p>
                            We may collect, use, store and transfer different kinds of personal data
                            about you which we have grouped together as follows:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    <strong>Identity Data</strong>
                                    includes first name, maiden name, last name, username or similar
                                    identifier, marital status, title, date of birth and gender.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Contact Data</strong>
                                    includes billing address, delivery address, email address and
                                    telephone numbers.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Financial Data</strong>
                                    includes bank account and payment card details.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Transaction Data</strong>
                                    includes details about payments to and from you and other
                                    details of products and services you have purchased from us.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Technical Data</strong>
                                    includes internet protocol (IP) address, your login data,
                                    browser type and version, time zone setting and location,
                                    browser plug-in types and versions, operating system and
                                    platform, and other technology on the devices you use to access
                                    this website.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Profile Data</strong>
                                    includes your username and password, purchases or orders made by
                                    you, your interests, preferences, feedback and survey responses.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Usage Data</strong>
                                    includes information about how you use our website, products and
                                    services.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong className="mr-1">
                                        Marketing and Communications Data
                                    </strong>
                                    includes your preferences in receiving marketing from us and our
                                    third parties and your communication preferences.
                                </p>
                            </li>
                        </ul>
                        <p>
                            We also collect, use and share <strong>Aggregated Data</strong> such as
                            statistical or demographic data for any purpose. Aggregated Data could
                            be derived from your personal data but is not considered personal data
                            in law as this data will <strong>not</strong> directly or indirectly
                            reveal your identity. For example, we may aggregate your Usage Data to
                            calculate the percentage of users accessing a specific website feature.
                            However, if we combine or connect Aggregated Data with your personal
                            data so that it can directly or indirectly identify you, we treat the
                            combined data as personal data which will be used in accordance with
                            this privacy policy.
                        </p>
                        <p>
                            We do not collect any{" "}
                            <strong>Special Categories of Personal Data</strong>
                            about you (this includes details about your race or ethnicity, religious
                            or philosophical beliefs, sex life, sexual orientation, political
                            opinions, trade union membership, information about your health, and
                            genetic and biometric data). Nor do we collect any information about
                            criminal convictions and offences.
                        </p>
                        <p>
                            <strong>If you fail to provide personal data</strong>
                        </p>
                        <p>
                            Where we need to collect personal data by law, or under the terms of a
                            contract we have with you, and you fail to provide that data when
                            requested, we may not be able to perform the contract we have or are
                            trying to enter into with you (for example, to provide you with goods or
                            services). In this case, we may have to cancel a product or service you
                            have with us but we will notify you if this is the case at the time.
                        </p>
                        <ol start="3">
                            <li>
                                <p>How is your personal data collected?</p>
                            </li>
                        </ol>
                        <p>
                            We use different methods to collect data from and about you including
                            through:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    <strong>Direct interactions.</strong>
                                    You may give us your [Identity, Contact and Financial Data] by
                                    filling in forms or by corresponding with us by post, phone,
                                    email or otherwise. This includes personal data you provide when
                                    you:
                                </p>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <p>apply for our products or services;</p>
                            </li>
                            <li>
                                <p>create an account on our website;</p>
                            </li>
                            <li>
                                <p>subscribe to our service or publications;</p>
                            </li>
                            <li>
                                <p>request marketing to be sent to you;</p>
                            </li>
                            <li>
                                <p>enter a competition, promotion or survey; or</p>
                            </li>
                            <li>
                                <p>give us feedback or contact us.</p>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <p>
                                    <strong>Automated technologies or interactions.</strong>
                                    As you interact with our website, we will automatically collect
                                    Technical Data about your equipment, browsing actions and
                                    patterns. We collect this personal data by using cookies, server
                                    logs and other similar technologies. We may also receive
                                    Technical Data about you if you visit other websites employing
                                    our cookies. Please see our cookie policy [LINK] for further
                                    details.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Third parties or publicly available sources.</strong>
                                    We will receive personal data about you from various third
                                    parties [and public sources] as set out below:
                                </p>
                            </li>
                        </ul>
                        <p>Technical Data from the following parties:</p>
                        <p>(a) analytics providers such as Google based outside the EU;</p>
                        <p>
                            (b) advertising networks based inside <strong>OR</strong> outside the
                            EU; and
                        </p>
                        <p>
                            (c) search information providers based inside <strong>OR</strong>{" "}
                            outside the EU.
                        </p>
                        <ul>
                            <li>
                                <p>
                                    Contact, Financial and Transaction Data from providers of
                                    technical, payment and delivery services based inside{" "}
                                    <strong>OR</strong> outside the EU.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Identity and Contact Data from data brokers or aggregators based
                                    inside <strong>OR</strong> outside the EU.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Identity and Contact Data from publicly available sources such
                                    as Companies House and the Electoral Register based inside the
                                    EU.
                                </p>
                            </li>
                        </ul>
                        <ol start="4">
                            <li>
                                <p>How we use your personal data</p>
                            </li>
                        </ol>
                        <p>
                            We will only use your personal data when the law allows us to. Most
                            commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    Where we need to perform the contract we are about to enter into
                                    or have entered into with you.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Where it is necessary for our legitimate interests (or those of
                                    a third party) and your interests and fundamental rights do not
                                    override those interests.
                                </p>
                            </li>
                            <li>
                                <p>Where we need to comply with a legal obligation.</p>
                            </li>
                        </ul>
                        <p>
                            Click <a href="#a108510">here</a> to find out more about the types of
                            lawful basis that we will rely on to process your personal data.
                        </p>
                        <p>
                            Generally, we do not rely on consent as a legal basis for processing
                            your personal data although we will get your consent before sending
                            third party direct marketing communications to you via email or text
                            message. You have the right to withdraw consent to marketing at any time
                            by contacting us.
                        </p>
                        <p>
                            <strong>Purposes for which we will use your personal data</strong>
                        </p>
                        <p>
                            We have set out below, in a table format, a description of all the ways
                            we plan to use your personal data, and which of the legal bases we rely
                            on to do so. We have also identified what our legitimate interests are
                            where appropriate.
                        </p>
                        <p>
                            Note that we may process your personal data for more than one lawful
                            ground depending on the specific purpose for which we are using your
                            data. Please contact us if you need details about the specific legal
                            ground we are relying on to process your personal data where more than
                            one ground has been set out in the table below.
                        </p>
                        <table width="967" cellSpacing="0" cellPadding="11">
                            <colgroup>
                                <col width="302" />
                                <col width="225" />
                                <col width="373" />
                            </colgroup>
                            <tbody>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            <strong>Purpose/Activity</strong>
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>
                                            <strong>Type of data</strong>
                                        </p>
                                    </td>
                                    <td width="373">
                                        <p>
                                            <strong>
                                                Lawful basis for processing including basis of
                                                legitimate interest
                                            </strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>To register you as a new customer</p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                    </td>
                                    <td width="373">
                                        <p>Performance of a contract with you</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>To process and deliver your order including:</p>
                                        <p>(a) Manage payments, fees and charges</p>
                                        <p>(b) Collect and recover money owed to us</p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Financial</p>
                                        <p>(d) Transaction</p>
                                        <p>(e) Marketing and Communications</p>
                                    </td>
                                    <td width="373">
                                        <p>(a) Performance of a contract with you</p>
                                        <p>
                                            (b) Necessary for our legitimate interests (to recover
                                            debts due to us)
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To manage our relationship with you which will include:
                                        </p>
                                        <p>
                                            (a) Notifying you about changes to our terms or privacy
                                            policy
                                        </p>
                                        <p>(b) Asking you to leave a review or take a survey</p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Profile</p>
                                        <p>(d) Marketing and Communications</p>
                                    </td>
                                    <td width="373">
                                        <p>(a) Performance of a contract with you</p>
                                        <p>(b) Necessary to comply with a legal obligation</p>
                                        <p>
                                            (c) Necessary for our legitimate interests (to keep our
                                            records updated and to study how customers use our
                                            products/services)
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To enable you to partake in a prize draw, competition or
                                            complete a survey
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Profile</p>
                                        <p>(d) Usage</p>
                                        <p>(e) Marketing and Communications</p>
                                    </td>
                                    <td width="373">
                                        <p>(a) Performance of a contract with you</p>
                                        <p>
                                            (b) Necessary for our legitimate interests (to study how
                                            customers use our products/services, to develop them and
                                            grow our business)
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To administer and protect our business and this website
                                            (including troubleshooting, data analysis, testing,
                                            system maintenance, support, reporting and hosting of
                                            data)
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Technical</p>
                                    </td>
                                    <td width="373">
                                        <p>
                                            (a) Necessary for our legitimate interests (for running
                                            our business, provision of administration and IT
                                            services, network security, to prevent fraud and in the
                                            context of a business reorganisation or group
                                            restructuring exercise)
                                        </p>
                                        <p>(b) Necessary to comply with a legal obligation</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To deliver relevant website content and advertisements
                                            to you and measure or understand the effectiveness of
                                            the advertising we serve to you
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Profile</p>
                                        <p>(d) Usage</p>
                                        <p>(e) Marketing and Communications</p>
                                        <p>(f) Technical</p>
                                    </td>
                                    <td width="373">
                                        <p>
                                            Necessary for our legitimate interests (to study how
                                            customers use our products/services, to develop them, to
                                            grow our business and to inform our marketing strategy)
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To use data analytics to improve our website,
                                            products/services, marketing, customer relationships and
                                            experiences
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Technical</p>
                                        <p>(b) Usage</p>
                                    </td>
                                    <td width="373">
                                        <p>
                                            Necessary for our legitimate interests (to define types
                                            of customers for our products and services, to keep our
                                            website updated and relevant, to develop our business
                                            and to inform our marketing strategy)
                                        </p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <td width="302">
                                        <p>
                                            To make suggestions and recommendations to you about
                                            goods or services that may be of interest to you
                                        </p>
                                    </td>
                                    <td width="225">
                                        <p>(a) Identity</p>
                                        <p>(b) Contact</p>
                                        <p>(c) Technical</p>
                                        <p>(d) Usage</p>
                                        <p>(e) Profile</p>
                                        <p>(f) Marketing and Communications</p>
                                    </td>
                                    <td width="373">
                                        <p>
                                            Necessary for our legitimate interests (to develop our
                                            products/services and grow our business)
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>
                            <strong>Marketing</strong>
                        </p>
                        <p>
                            We strive to provide you with choices regarding certain personal data
                            uses, particularly around marketing and advertising.
                        </p>
                        <p>
                            <strong>Promotional offers from us</strong>
                        </p>
                        <p>
                            We may use your Identity, Contact, Technical, Usage and Profile Data to
                            form a view on what we think you may want or need, or what may be of
                            interest to you. This is how we decide which products, services and
                            offers may be relevant for you (we call this marketing).
                        </p>
                        <p>
                            You will receive marketing communications from us if you have requested
                            information from us or purchased goods or services from us and you have
                            not opted out of receiving that marketing.
                        </p>
                        <p>
                            <strong>Third-party marketing</strong>
                        </p>
                        <p>
                            We will get your express opt-in consent before we share your personal
                            data with any third party for marketing purposes.
                        </p>
                        <p>
                            <strong>Opting out</strong>
                        </p>
                        <p>
                            You can ask us or third parties to stop sending you marketing messages
                            at any time by logging into the website and checking or unchecking
                            relevant boxes to adjust your marketing preferences <strong>OR</strong>{" "}
                            by following the opt-out links on any marketing message sent to you{" "}
                            <strong>OR</strong>
                            by contacting us at any time.
                        </p>
                        <p>
                            Where you opt out of receiving these marketing messages, this will not
                            apply to personal data provided to us as a result of a product/service
                            purchase, product/service experience or other transactions.
                        </p>
                        <p>
                            <strong>Cookies</strong>
                        </p>
                        <p>
                            You can set your browser to refuse all or some browser cookies, or to
                            alert you when websites set or access cookies. If you disable or refuse
                            cookies, please note that some parts of this website may become
                            inaccessible or not function properly. For more information about the
                            cookies we use, please see [LINK TO YOUR COOKIE POLICY].
                        </p>
                        <p>
                            <strong>Change of purpose</strong>
                        </p>
                        <p>
                            We will only use your personal data for the purposes for which we
                            collected it, unless we reasonably consider that we need to use it for
                            another reason and that reason is compatible with the original purpose.
                            If you wish to get an explanation as to how the processing for the new
                            purpose is compatible with the original purpose, please contact us.
                        </p>
                        <p>
                            If we need to use your personal data for an unrelated purpose, we will
                            notify you and we will explain the legal basis which allows us to do so.
                        </p>
                        <p>
                            Please note that we may process your personal data without your
                            knowledge or consent, in compliance with the above rules, where this is
                            required or permitted by law.
                        </p>
                        <ol start="5">
                            <li>
                                <p>Disclosures of your personal data</p>
                            </li>
                        </ol>
                        <p>
                            We may share your personal data with the parties set out below for the
                            purposes set out in the table{" "}
                            <em>Purposes for which we will use your personal data</em> above.
                        </p>
                        <ul>
                            <li>
                                <p>
                                    External Third Parties as set out in the <em>Glossary</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Specific third parties listed in the table [
                                    <em>Purposes for which we will use your personal data</em>]
                                    above <strong>.</strong>
                                </p>
                            </li>
                            <li>
                                <p>
                                    Third parties to whom we may choose to sell, transfer or merge
                                    parts of our business or our assets. Alternatively, we may seek
                                    to acquire other businesses or merge with them. If a change
                                    happens to our business, then the new owners may use your
                                    personal data in the same way as set out in this privacy policy.
                                </p>
                            </li>
                        </ul>
                        <p>
                            We require all third parties to respect the security of your personal
                            data and to treat it in accordance with the law. We do not allow our
                            third-party service providers to use your personal data for their own
                            purposes and only permit them to process your personal data for
                            specified purposes and in accordance with our instructions.
                        </p>
                        <ol start="6">
                            <li>
                                <p>International transfers</p>
                            </li>
                        </ol>
                        <p>
                            We do not transfer your personal data outside the European Economic Area
                            ( <strong>EEA</strong>).
                        </p>
                        <p>
                            Whenever we transfer your personal data out of the EEA, we ensure a
                            similar degree of protection is afforded to it by ensuring at least one
                            of the following safeguards is implemented :
                        </p>
                        <ul>
                            <li>
                                <p>
                                    We will only transfer your personal data to countries that have
                                    been deemed to provide an adequate level of protection for
                                    personal data by the European Commission. For further details,
                                    see
                                    <em>
                                        European Commission: Adequacy of the protection of personal
                                        data in non-EU countries
                                    </em>
                                    .
                                </p>
                            </li>
                            <li>
                                <p>
                                    Where we use certain service providers, we may use specific
                                    contracts approved by the European Commission which give
                                    personal data the same protection it has in Europe. For further
                                    details, see
                                    <em>
                                        European Commission: Model contracts for the transfer of
                                        personal data to third countries
                                    </em>
                                    .
                                </p>
                            </li>
                            <li>
                                <p>
                                    Where we use providers based in the US, we may transfer data to
                                    them if they are part of the Privacy Shield which requires them
                                    to provide similar protection to personal data shared between
                                    Europe and the US. For further details, see{" "}
                                    <em>European Commission: EU-US Privacy Shield</em>.
                                </p>
                            </li>
                        </ul>
                        <p>
                            Please contact us if you want further information on the specific
                            mechanism used by us when transferring your personal data out of the
                            EEA.
                        </p>
                        <ol start="7">
                            <li>
                                <p>Data security</p>
                            </li>
                        </ol>
                        <p>
                            We have put in place appropriate security measures to prevent your
                            personal data from being accidentally lost, used or accessed in an
                            unauthorised way, altered or disclosed. In addition, we limit access to
                            your personal data to those employees, agents, contractors and other
                            third parties who have a business need to know. They will only process
                            your personal data on our instructions and they are subject to a duty of
                            confidentiality.
                        </p>
                        <p>
                            We have put in place procedures to deal with any suspected personal data
                            breach and will notify you and any applicable regulator of a breach
                            where we are legally required to do so.
                        </p>
                        <ol start="8">
                            <li>
                                <p>Data retention</p>
                            </li>
                        </ol>
                        <p>
                            <strong>How long will you use my personal data for?</strong>
                        </p>
                        <p>
                            We will only retain your personal data for as long as reasonably
                            necessary to fulfil the purposes we collected it for, including for the
                            purposes of satisfying any legal, regulatory, tax, accounting or
                            reporting requirements. We may retain your personal data for a longer
                            period in the event of a complaint or if we reasonably believe there is
                            a prospect of litigation in respect to our relationship with you.
                        </p>
                        <p>
                            To determine the appropriate retention period for personal data, we
                            consider the amount, nature and sensitivity of the personal data, the
                            potential risk of harm from unauthorised use or disclosure of your
                            personal data, the purposes for which we process your personal data and
                            whether we can achieve those purposes through other means, and the
                            applicable legal, regulatory, tax, accounting or other requirements.
                        </p>
                        <p>
                            In some circumstances you can ask us to delete your data: see{" "}
                            <em>your legal rights</em> below for further information.
                        </p>
                        <p>
                            In some circumstances we will anonymise your personal data (so that it
                            can no longer be associated with you) for research or statistical
                            purposes, in which case we may use this information indefinitely without
                            further notice to you.
                        </p>
                        <ol start="9">
                            <li>
                                <p>Your legal rights</p>
                            </li>
                        </ol>
                        <p>
                            Under certain circumstances, you have rights under data protection laws
                            in relation to your personal data. Please click on the links below to
                            find out more about these rights:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    <em>Request access to your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Request correction of your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Request erasure of your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Object to processing of your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Request restriction of processing your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Request transfer of your personal data</em>.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <em>Right to withdraw consent</em>.
                                </p>
                            </li>
                        </ul>
                        <p>
                            If you wish to exercise any of the rights set out above, please contact
                            us: <a href="mailto:support@loopcycle.io">support@loopcycle.io</a>.
                        </p>
                        <p>
                            <strong>No fee usually required</strong>
                        </p>
                        <p>
                            You will not have to pay a fee to access your personal data (or to
                            exercise any of the other rights). However, we may charge a reasonable
                            fee if your request is clearly unfounded, repetitive or excessive.
                            Alternatively, we could refuse to comply with your request in these
                            circumstances.
                        </p>
                        <p>
                            <strong>What we may need from you</strong>
                        </p>
                        <p>
                            We may need to request specific information from you to help us confirm
                            your identity and ensure your right to access your personal data (or to
                            exercise any of your other rights). This is a security measure to ensure
                            that personal data is not disclosed to any person who has no right to
                            receive it. We may also contact you to ask you for further information
                            in relation to your request to speed up our response.
                        </p>
                        <p>
                            <strong>Time limit to respond</strong>
                        </p>
                        <p>
                            We try to respond to all legitimate requests within one calendar month.
                            Occasionally it could take us longer than a month if your request is
                            particularly complex or you have made a number of requests. In this
                            case, we will notify you and keep you updated.
                        </p>
                        <ol start="10">
                            <li>
                                <p>Glossary</p>
                            </li>
                        </ol>
                        <p>
                            <strong>LAWFUL BASIS</strong>
                        </p>
                        <p>
                            <strong>Legitimate Interest</strong>
                            means the interest of our business in conducting and managing our
                            business to enable us to give you the best service/product and the best
                            and most secure experience. We make sure we consider and balance any
                            potential impact on you (both positive and negative) and your rights
                            before we process your personal data for our legitimate interests. We do
                            not use your personal data for activities where our interests are
                            overridden by the impact on you (unless we have your consent or are
                            otherwise required or permitted to by law). You can obtain further
                            information about how we assess our legitimate interests against any
                            potential impact on you in respect of specific activities by contacting
                            us.
                        </p>
                        <p>
                            <strong>Performance of Contract</strong>
                            means processing your data where it is necessary for the performance of
                            a contract to which you are a party or to take steps at your request
                            before entering into such a contract.
                        </p>
                        <p>
                            <strong>Comply with a legal obligation</strong>
                            means processing your personal data where it is necessary for compliance
                            with a legal obligation that we are subject to.
                        </p>
                        <p>
                            <strong>THIRD PARTIES</strong>
                        </p>
                        <p>
                            <strong>External Third Parties</strong>
                        </p>
                        <ul>
                            <li>
                                <p>
                                    Service providers acting as processors based in the United
                                    Kingdom, EU or North America who provide IT and system
                                    administration services.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Professional advisers acting as processors or joint controllers
                                    including lawyers, bankers, auditors and insurers based within
                                    the United Kingdom who provide consultancy, banking, legal,
                                    insurance and accounting services.
                                </p>
                            </li>
                            <li>
                                <p>
                                    HM Revenue &amp; Customs, regulators and other authorities
                                    acting as processors or joint controllers based in the United
                                    Kingdom who require reporting of processing activities in
                                    certain circumstances.
                                </p>
                            </li>
                        </ul>
                        <p>
                            <strong>YOUR LEGAL RIGHTS</strong>
                        </p>
                        <p>You have the right to:</p>
                        <p>
                            <strong>Request access</strong>
                            to your personal data (commonly known as a "data subject access
                            request"). This enables you to receive a copy of the personal data we
                            hold about you and to check that we are lawfully processing it.
                        </p>
                        <p>
                            <strong>Request correction</strong>
                            of the personal data that we hold about you. This enables you to have
                            any incomplete or inaccurate data we hold about you corrected, though we
                            may need to verify the accuracy of the new data you provide to us.
                        </p>
                        <p>
                            <strong>Request erasure</strong>
                            of your personal data. This enables you to ask us to delete or remove
                            personal data where there is no good reason for us continuing to process
                            it. You also have the right to ask us to delete or remove your personal
                            data where you have successfully exercised your right to object to
                            processing (see below), where we may have processed your information
                            unlawfully or where we are required to erase your personal data to
                            comply with local law. Note, however, that we may not always be able to
                            comply with your request of erasure for specific legal reasons which
                            will be notified to you, if applicable, at the time of your request.
                        </p>
                        <p>
                            <strong>Object to processing</strong>
                            of your personal data where we are relying on a legitimate interest (or
                            those of a third party) and there is something about your particular
                            situation which makes you want to object to processing on this ground as
                            you feel it impacts on your fundamental rights and freedoms. You also
                            have the right to object where we are processing your personal data for
                            direct marketing purposes. In some cases, we may demonstrate that we
                            have compelling legitimate grounds to process your information which
                            override your rights and freedoms.
                        </p>
                        <p>
                            <strong>Request restriction of processing</strong>
                            of your personal data. This enables you to ask us to suspend the
                            processing of your personal data in the following scenarios:
                        </p>
                        <ul>
                            <li>
                                <p>If you want us to establish the data's accuracy.</p>
                            </li>
                            <li>
                                <p>
                                    Where our use of the data is unlawful but you do not want us to
                                    erase it.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Where you need us to hold the data even if we no longer require
                                    it as you need it to establish, exercise or defend legal claims.
                                </p>
                            </li>
                            <li>
                                <p>
                                    You have objected to our use of your data but we need to verify
                                    whether we have overriding legitimate grounds to use it.
                                </p>
                            </li>
                        </ul>
                        <p>
                            <strong>Request the transfer</strong>
                            of your personal data to you or to a third party. We will provide to
                            you, or a third party you have chosen, your personal data in a
                            structured, commonly used, machine-readable format. Note that this right
                            only applies to automated information which you initially provided
                            consent for us to use or where we used the information to perform a
                            contract with you.
                        </p>
                        <p>
                            <strong>Withdraw consent at any time</strong>
                            where we are relying on consent to process your personal data. However,
                            this will not affect the lawfulness of any processing carried out before
                            you withdraw your consent. If you withdraw your consent, we may not be
                            able to provide certain products or services to you. We will advise you
                            if this is the case at the time you withdraw your consent.
                        </p>
                    </div>
                </div>
            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default Privacy;
