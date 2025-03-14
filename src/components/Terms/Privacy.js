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
                    <div className="col">

                        <section className="mb-4">
                            <h4>INTRODUCTION</h4>
                            <p>
                                Welcome to our privacy policy.
                                <br/>
                                Loop Infinity Ltd respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                                <br/><br/>
                                This privacy policy is provided in a layered format so you can click through to the specific areas set out below. Please also use the Glossary to understand the meaning of some of the terms used in this privacy policy.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Important information and who we are</h4>
                            <p>
                                <b>Purpose of this privacy policy</b>
                                <br/>
                                This privacy policy aims to give you information on how Loop Infinity Ltd collects and processes your personal data through your use of this website, including any data you may provide through this website when you purchase a product or service.
                                <br/>
                                This website is not intended for children and we do not knowingly collect data relating to children.
                                <br/>
                                It is important that you read this privacy policy together with any other privacy policy or fair processing policy we may provide on specific occasions when we are collecting or processing personal data about you so that you are fully aware of how and why we are using your data. This privacy policy supplements other notices and privacy policies and is not intended to override them.
                                <br/>
                                <b>Controller</b>
                                <br/>
                                Loop Infinity Ltd is the controller and responsible for your personal data (collectively referred to as "we", "us" or "our" in this privacy policy).
                                <br/>
                                We have appointed a Product Manager who is responsible for overseeing questions in relation to this privacy policy. If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact the Product Manager using the details set out below.
                                <br/>
                                <b>Contact details</b>
                                <br/>
                                If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:
                                <br/>
                                Full name of legal entity: <b>Loop Infinity Ltd</b>
                                <br/>
                                Reference (to be quoted in the subject heading): Loopcycle Privacy Policy
                                <br/>
                                Email address: <b>hello@loopcycle.io</b>
                                <br/>
                                Postal address: <b>Camden Collective, 5-7 Buck Street, London NW1 8NJ</b>
                                <br/>
                                You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues (www.ico.org.uk). We would, however, appreciate the chance to deal with your concerns before you approach the ICO so please contact us in the first instance.
                                <br/>
                                <b>Changes to the privacy policy and your duty to inform us of changes</b>
                                <br/>
                                We keep our privacy policy under regular review.
                                <br/>
                                It is important that the personal data we hold about you is accurate and current. Please keep us informed if your personal data changes during your relationship with us.
                                <br/>
                                <b>Third-party links</b>
                                <br/>
                                This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
                            </p>
                        </section>


                        <section className="mb-4">
                            <h4>The data we collect about you</h4>
                            <p>
                                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
                                <br/>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                <br/>
                                <b>Identity Data</b> includes first name last name, username or similar identifier.
                                <br/>
                                <b>Contact Data</b> includes billing address, delivery address and email address.
                                <br/>
                                [<b>Financial Data</b> includes bank account and payment card details].Note: via third party payment provider only?
                                <br/>
                                <b>Transaction Data</b> includes details about payments to and from you and other details of products and services you have purchased from our Marketplace (including information about delivery locations and previous owners.
                                <br/>
                                <b>Technical Data</b> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.
                                <br/>
                                <b>Profile Data</b> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.
                                <br/>
                                <b>Usage Data</b> includes information about how you use our website, products and services.
                                <br/>
                                <b>Marketing and Communications Data</b> includes your preferences in receiving marketing from us and our third parties and your communication preferences.
                                <br/><br/>
                                We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data could be derived from your personal data but is not considered personal data in law as this data will not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy policy.
                                <br/>
                                We do not collect any <b>Special Categories of Personal Data</b> about you (this includes details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health, and genetic and biometric data). Nor do we collect any information about criminal convictions and offences.
                                <br/>
                                <b>If you fail to provide personal data</b>
                                <br/>
                                Where we need to collect personal data by law, or under the terms of a contract we have with you, and you fail to provide that data when requested, we may not be able to perform the contract we have or are trying to enter into with you (for example, to provide you with goods or services). In this case, we may have to cancel a product or service you have with us but we will notify you if this is the case at the time.

                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>How is your personal data collected?</h4>
                            <p>
                                We use different methods to collect data from and about you including through:
                                <br/>
                                <b>Direct interactions.</b> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you:
                                <br/>
                                apply for or services available in our online Marketplace;
                                <br/>
                                create an account on our website;
                                <br/>
                                request marketing to be sent to you;
                                <br/>
                                enter a survey; or
                                <br/>
                                give us feedback or contact us.
                                <br/>
                                <b>Automated technologies or interactions.</b> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies. We may also receive Technical Data about you if you visit other websites employing our cookies. Please see our cookie policy [LINK] for further details.
                                <br/><br/>
                                Third parties or publicly available sources. We will receive personal data about you from various third parties [and public sources] as set out below:
                                <br/>
                                <b>Technical Data from the following parties:</b>
                                <br/>
                                a)	analytics providers [such as Google based outside the EU];
                                <br/>
                                b)	advertising networks [such as [NAME] based [inside OR outside] the EU]; and
                                <br/>
                                c)	search information providers [such as [NAME] based [inside OR outside] the EU].
                                <br/><br/>
                                Contact, Financial and Transaction Data from providers of technical, payment and delivery services [such as [NAME] based [inside OR outside] the EU].
                                <br/>
                                Identity and Contact Data from data brokers or aggregators [such as [NAME] based [inside OR outside] the EU].
                                <br/>
                                Identity and Contact Data from publicly available sources [such as Companies House and the Electoral Register based inside the EU].

                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>How we use your personal data</h4>
                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <p>Where we need to perform the contract we are about to enter into or have entered into with you.
                                <br/>
                                Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
                                <br/>
                                Where we need to comply with a legal obligation.</p>
                            <p>
                                Click here to find out more about the types of lawful basis that we will rely on to process your personal data.
                                <br/><br/>
                                Generally, we do not rely on consent as a legal basis for processing your personal data although we will get your consent before sending third party direct marketing communications to you via email or text message. You have the right to withdraw consent to marketing at any time by contacting us.
                            </p>

                            <p>
                                <b>Purposes for which we will use your personal data</b>
                                <br/>
                                We have set out below, in a table format, a description of all the ways we plan to use your personal data, and which of the legal bases we rely on to do so. We have also identified what our legitimate interests are where appropriate.
                                <br/>
                                Note that we may process your personal data for more than one lawful ground depending on the specific purpose for which we are using your data. Please contact us if you need details about the specific legal ground we are relying on to process your personal data where more than one ground has been set out in the table below.
                            </p>

                            <table className="table">
                                <thead>
                                    <th>Purpose/Activity</th>
                                    <th>Type of data</th>
                                    <th>Lawful basis for processing including basis of legitimate interest</th>
                                </thead>
                                <tbody>
                                    <tr>
                                      <td>
                                          To register you as a new user
                                      </td>
                                        <td>
                                            a) Identity
                                                <br/>
                                                b) Contact
                                        </td>
                                        <td>
                                            Performance of a contract with you
                                        </td>
                                    </tr>
                                
                                    <tr>
                                        <td>
                                            To process and deliver our Services to you
                                            <br/>
                                            [a) Manage payments, fees and charges] Note: via third parties only?
                                            <br/>
                                            b) Collect and recover money owed to us
                                        </td>
                                        <td>
                                            a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Financial
                                            <br/>
                                            d) Transaction
                                            <br/>
                                            e) Marketing and Communications
                                        </td>
                                        <td>
                                            a) Performance of a contract with you
                                            <br/>
                                            b) Necessary for our legitimate interests (to recover debts due to us)
                                        </td>
                                    </tr>
                                
                                    <tr>
                                        <td>To manage our relationship with you which will include:
                                            <br/>
                                            a) Notifying you about changes to our terms or privacy policy
                                            <br/>
                                            b) Asking you to leave a review or take a survey
                                        </td>
                                        <td>"a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Profile
                                            <br/>
                                            d) Marketing and Communications"</td>
                                        <td>
                                            a) Performance of a contract with you
                                            <br/>
                                            b) Necessary to comply with a legal obligation
                                            <br/>
                                            c) Necessary for our legitimate interests (to keep our records updated and to study how customers use our products/services)
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>To enable you to partake in a prize draw, competition or complete a survey</td>
                                        <td>
                                            "a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Profile
                                            <br/>
                                            d) Usage
                                            <br/>
                                            e) Marketing and Communications"
                                        </td>
                                        <td>
                                            a) Performance of a contract with you
                                            <br/>
                                            b) Necessary for our legitimate interests (to study how customers use our products/services, to develop them and grow our business)
                                        </td>
                                    </tr>
                                
                                    <tr>
                                        <td>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data)</td>
                                        <td>a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Technical</td>
                                        <td>
                                            a) Necessary for our legitimate interests (for running our business, provision of administration and IT services, network security, to prevent fraud and in the context of a business reorganisation or group restructuring exercise)
                                            <br/>
                                            b) Necessary to comply with a legal obligation
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you</td>
                                        <td>a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Profile
                                            <br/>
                                            d) Usage
                                            <br/>
                                            e) Marketing and Communications
                                            f) Technical</td>
                                        <td>Necessary for our legitimate interests (to study how customers use our products/services, to develop them, to grow our business and to inform our marketing strategy)</td>
                                    </tr>
                                
                                <tr>
                                    <td>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences</td>
                                    <td>a) Technical
                                        <br/>
                                        b) Usage</td>
                                    <td>Necessary for our legitimate interests (to define types of customers for our products and services, to keep our website updated and relevant, to develop our business and to inform our marketing strategy)</td>
                                </tr>

                                    <tr>
                                        <td>To make suggestions and recommendations to you about goods or services that may be of interest to you</td>
                                        <td>a) Identity
                                            <br/>
                                            b) Contact
                                            <br/>
                                            c) Technical
                                            <br/>
                                            d) Usage
                                            <br/>
                                            e) Profile
                                            <br/>
                                            f) Marketing and Communications"</td>
                                        <td>
                                            Necessary for our legitimate interests (to develop our products/services and grow our business)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </section>

                        <section className="mb-4">
                            <p>
                                <b>Marketing</b>
                                <br/>
                                We strive to provide you with choices regarding certain personal data uses, particularly around marketing and advertising.
                                <br/><br/>
                                <b>Promotional offers from us</b>
                                <br/>
                                We may use your Identity, Contact, Technical, Usage and Profile Data to form a view on what we think you may want or need, or what may be of interest to you. This is how we decide which products, services and offers may be relevant for you (we call this marketing).
                                <br/>
                                You will receive marketing communications from us if you have requested information from us or purchased goods or services from us and you have not opted out of receiving that marketing.
                                <br/><br/>
                                <b>Third-party marketing</b>
                                <br/>
                                We will get your express opt-in consent before we share your personal data with any third party for marketing purposes. Note: this will apply when you provide information to the manufactures about their product history etc
                                <br/><br/>
                                <b>Opting out</b>
                                <br/>
                                You can ask us or third parties to stop sending you marketing messages at any time [by logging into the website and checking or unchecking relevant boxes to adjust your marketing preferences OR by following the opt-out links on any marketing message sent to you OR by contacting us at any time].
                                <br/>
                                Where you opt out of receiving these marketing messages, this will not apply to personal data provided to us as a result of a product/service purchase, product/service experience or other transactions.
                                <br/><br/>
                                <b>Cookies</b>
                                <br/>
                                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. For more information about the cookies we use, please see Cookie Policy
                                <br/><br/>
                                <b>Change of purpose</b>
                                <br/>
                                We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. If you wish to get an explanation as to how the processing for the new purpose is compatible with the original purpose, please contact us.
                                <br/>
                                If we need to use your personal data for an unrelated purpose, we will notify you and we will explain the legal basis which allows us to do so.
                                <br/>
                                Please note that we may process your personal data without your knowledge or consent, in compliance with the above rules, where this is required or permitted by law.

                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Disclosures of your personal data</h4>
                            <p>We may share your personal data with the parties set out below for the purposes set out in the table Purposes for which we will use your personal data above.</p>
                            <p>
                                External Third Parties as set out in the Glossary.
                                <br/>
                                [Specific third parties [listed in the table [Purposes for which we will use your personal data] above.
                                <br/>
                                Third parties to whom we may choose to sell, transfer or merge parts of our business or our assets. Alternatively, we may seek to acquire other businesses or merge with them. If a change happens to our business, then the new owners may use your personal data in the same way as set out in this privacy policy.
                            </p>
                            <p>We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.</p>
                        </section>

                        <section className="mb-4">
                            <h4>International transfers</h4>
                            <p>
                                We do not transfer your personal data outside the European Economic Area (EEA).
                                <br/><br/>
                                Whenever we transfer your personal data out of the EEA, we ensure a similar degree of protection is afforded to it by ensuring at least one of the following safeguards is implemented :
                                <br/><br/>
                                We will only transfer your personal data to countries that have been deemed to provide an adequate level of protection for personal data by the European Commission. For further details, see European Commission: Adequacy of the protection of personal data in non-EU countries.
                                <br/><br/>
                                Where we use certain service providers, we may use specific contracts approved by the European Commission which give personal data the same protection it has in Europe. For further details, see European Commission: Model contracts for the transfer of personal data to third countries.
                                <br/><br/>
                                Where we use providers based in the US, we may transfer data to them if they are part of the Privacy Shield which requires them to provide similar protection to personal data shared between Europe and the US. For further details, see European Commission: EU-US Privacy Shield.
                                <br/><br/>
                                Please contact us if you want further information on the specific mechanism used by us when transferring your personal data out of the EEA.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Data security</h4>
                            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                                <br/>
                                We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.</p>
                        </section>

                        <section className="mb-4">
                            <h4>Data retention</h4>
                            <p><b>How long will you use my personal data for?</b></p>
                            <p>We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
                                <br/><br/>
                                To determine the appropriate retention period for personal data, we consider the amount, nature and sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal, regulatory, tax, accounting or other requirements.
                                <br/><br/>
                                In some circumstances you can ask us to delete your data: see your legal rights below for further information.
                                <br/><br/>
                                In some circumstances we will anonymise your personal data (so that it can no longer be associated with you) for research or statistical purposes, in which case we may use this information indefinitely without further notice to you.</p>
                        </section>

                        <section className="mb-4">
                            <h4>Your legal rights</h4>
                            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. Please click on the links below to find out more about these rights:</p>
                            <p>Request access to your personal data.
                                <br/>
                                Request correction of your personal data.
                                <br/>
                                Request erasure of your personal data.
                                <br/>
                                Object to processing of your personal data.
                                <br/>
                                Request restriction of processing your personal data.
                                <br/>
                                Request transfer of your personal data.
                                <br/>
                                Right to withdraw consent.</p>

                            <p>If you wish to exercise any of the rights set out above, please contact us: support@loopcycle.io.</p>
                        </section>

                        <section className="mb-4">
                            <h4>No fee usually required</h4>
                            <p>
                                You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we could refuse to comply with your request in these circumstances.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>What we may need from you</h4>
                            <p>We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.</p>
                        </section>

                        <section className="mb-4">
                            <h4>Time limit to respond</h4>
                            <p>We try to respond to all legitimate requests within one calendar month. Occasionally it could take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.</p>
                        </section>

                        <section className="mb-4">
                            <h4>Glossary</h4>
                            <p><b>LAWFUL BASIS</b></p>
                            <p>
                                <b>Legitimate Interest</b> means the interest of our business in conducting and managing our business to enable us to give you the best service/product and the best and most secure experience. We make sure we consider and balance any potential impact on you (both positive and negative) and your rights before we process your personal data for our legitimate interests. We do not use your personal data for activities where our interests are overridden by the impact on you (unless we have your consent or are otherwise required or permitted to by law). You can obtain further information about how we assess our legitimate interests against any potential impact on you in respect of specific activities by contacting us.
                                <br/>
                                <b>Performance of Contract</b> means processing your data where it is necessary for the performance of a contract to which you are a party or to take steps at your request before entering into such a contract.
                                <br/>
                                <b>Comply with a legal obligation</b> means processing your personal data where it is necessary for compliance with a legal obligation that we are subject to.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>THIRD PARTIES</h4>
                            <p>
                                <b>External Third Parties</b>
                                <br/>
                                Service providers acting as processors based in the United Kingdom, EU or North America who provide IT and system administration services.
                                <br/>
                                Professional advisers acting as processors or joint controllers including lawyers, bankers, auditors and insurers based within the United Kingdom who provide consultancy, banking, legal, insurance and accounting services.
                                <br/>
                                HM Revenue & Customs, regulators and other authorities acting as processors or joint controllers based in the United Kingdom who require reporting of processing activities in certain circumstances.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>YOUR LEGAL RIGHTS</h4>
                            <p>
                                You have the right to:
                                <br/>
                                <b>Request access</b> to your personal data (commonly known as a "data subject access request"). This enables you to receive a copy of the personal data we hold about you and to check that we are lawfully processing it.
                                <br/><br/>
                                <b>Request correction </b>of the personal data that we hold about you. This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide to us.
                                <br/><br/>
                                <b>Request erasure</b> of your personal data. This enables you to ask us to delete or remove personal data where there is no good reason for us continuing to process it. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing (see below), where we may have processed your information unlawfully or where we are required to erase your personal data to comply with local law. Note, however, that we may not always be able to comply with your request of erasure for specific legal reasons which will be notified to you, if applicable, at the time of your request.
                                <br/><br/>
                                <b> Object to processing</b> of your personal data where we are relying on a legitimate interest (or those of a third party) and there is something about your particular situation which makes you want to object to processing on this ground as you feel it impacts on your fundamental rights and freedoms. You also have the right to object where we are processing your personal data for direct marketing purposes. In some cases, we may demonstrate that we have compelling legitimate grounds to process your information which override your rights and freedoms.
                                <br/><br/>
                                <b>Request restriction of processing</b> of your personal data. This enables you to ask us to suspend the processing of your personal data in the following scenarios:
                                <br/><br/>
                                If you want us to establish the data's accuracy.
                                <br/>
                                Where our use of the data is unlawful but you do not want us to erase it.
                                <br/>
                                Where you need us to hold the data even if we no longer require it as you need it to establish, exercise or defend legal claims.
                                <br/>
                                You have objected to our use of your data but we need to verify whether we have overriding legitimate grounds to use it.
                                <br/><br/>
                                <b>Request the transfer</b> of your personal data to you or to a third party. We will provide to you, or a third party you have chosen, your personal data in a structured, commonly used, machine-readable format. Note that this right only applies to automated information which you initially provided consent for us to use or where we used the information to perform a contract with you.
                                <br/><br/>
                                <b>Withdraw consent at any time</b> where we are relying on consent to process your personal data. However, this will not affect the lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide certain products or services to you. We will advise you if this is the case at the time you withdraw your consent.
                                <br/>
                            </p>
                        </section>

                    </div>
                </div>
            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default Privacy;
