import React, { useEffect } from "react";
import HeaderDark from "../../views/header/HeaderDark";
import Footer from "../../views/Footer/Footer";

const TermsAndService = ({ title, header, footer }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {header ? header : <HeaderDark />}
            <div className="container mb-5" style={{ marginTop: "100px" }}>
                <div className="row mt-5 mb-5">
                    <div className="col">
                        <h3 className="blue-text">{title ? title : "Terms and Service"}</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col">

                        <section className="mb-4">
                            <h4 className="text-capitalize">Our Terms of Service</h4>
                        </section>

                        <section className="mb-4">
                            <p><b>What these terms cover.</b> These are the terms and conditions on which we supply our Services and digital content to you.</p>
                        </section>

                        <section className="mb-4">
                            <p><b>Why you should read them. </b>Please read these terms carefully before you use our Services. These terms tell you who we are, how we will provide our Services to you, how you and we may change or end the contract, what to do if there is a problem and other important information. If you think that there is a mistake in these terms, please contact us via email at hello@loopcycle.io. </p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">Information about us and how to contact us</h4>
                            <p><b>Who we are.</b> We are Loop Infinity Ltd, a company registered in England and Wales. Our company registration number is 11456617 and our registered office is at Camden Collective, 5-7 Buck Street, London NW1 8NJ.</p>
                            <p><b>What we do:</b> We operate a business-to-business marketplace which uses artificial intelligence to trace the circulation of products between end users and product manufacturers, based on the information submitted by both parties (“Services”). </p>
                            <p><b>How to contact us.</b> You can contact us by writing to us at hello@loopcycle.io.</p>
                            <p><b>How we may contact you.</b> If we have to contact you we will do so by telephone or by writing to you at the email address or postal address you provided to us in your order.</p>
                            <p><b>"Writing" includes emails.</b> When we use the words "writing" or "written" in these terms, this includes emails.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">Our contract with you</h4>
                            <p><b>How we will accept your business.</b> By setting up an account with us and/or using and accessing the Service, you agree to and accept these terms in their entirety. If you do not agree to these terms, you may not use the Services.</p>
                            <p><b>We only promote to the United Kingdom.</b> Our website is solely for the promotion of our Services in the UK. </p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">Our Services</h4>
                            <p><b>Loopcycle Marketplace.</b> Our Service is an online marketplace that allows you to connect with other buyers and sellers (including manufacturers) in an easy and fun way. You can find out more information about our Services and its features [here]. We want our Service to be a positive experience for our users and we ask that you honour the commitments you make to another user in respect of the swap or collection/delivery of the item.</p>
                            <p><b>Relationship between buyers and sellers.</b> Any agreement for collection/delivery or swap is made solely between you and the party with whom you have agreed the transaction with. Our Service application may include functionality for suggesting more effective way to find the items desired, however the sellers have, at all times, total discretion how to disregard their advertised items. Complaints, questions and claims related to an item should be directed to the seller. Where users cannot resolve issues relating to an item themselves, we will attempt to help mediate such disputes through our dispute resolution process. </p>
                            <p><b>Payments.</b> We charge a fee of 20% of the agreed fee of every used product sold through Loopcycle. We also charge a fee for every product registered by manufacturers. These payments are taken through sales transactions on our platform or via a third party payment provider (such payments are to be governed by such providers terms of use). Alternatively, we may invoice for payment off the platform. </p>
                            <p><b>Changes to the Service.</b> We are constantly updating and improving the Service to try and find ways to provide you with new and innovative features and services. Improvements and updates are also made to reflect changing technologies, tastes, behaviours and the way people use the internet and our Services. We are under no obligation to provide uninterrupted access to our Services. Access to all or any part of the Services may be restricted from time to time to allow for repairs, maintenance or updating or for any other reason. We may update, amend, suspend, withdraw, discontinue or change all or any part of the Services at any time and without notice.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">your content</h4>
                            <p>You confirm that images, text or information that you submit or create (“User Listing”) whilst using the Service will comply with our Acceptable Use Policy.</p>
                            <p>You grant us a worldwide, non-exclusive, royalty-free, irrevocable and perpetual licence to use, copy, reproduce, distribute, adapt, re-format, modify, publish, translate, licence, sub-licence, assign, transfer, and exploit the User Listing (including any intellectual property rights therein) anywhere and in any form for the purposes of providing our Services.</p>
                            <p>Our right to use your User Listing dos not in any way affect your privacy rights and we will only use the information that identifies you as set out in our Privacy Policy.</p>
                            <p>We do not check or moderate any User Listing before it is added to the Service by users. We may later check, moderate, reject, refuse or delete any User Listing if we think that it breaks any of the terms of our Acceptable Use Policy.</p>
                            <p>User Content removed from the Services may continue to be stored by us, including, without limitation, in order to comply with certain legal obligations. Therefore, we encourage you to maintain your own backup of your User Listing and you agree that you will not rely on the Service for the purposes of User Listing backup or storage. To the extent permitted by applicable law, we shall have no liability for any loss of User Listing.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">INTELLECTUAL PROPERTY</h4>
                            <p>The intellectual property rights in all materials and content comprising the Service, including but not limited to images, written content and designs on each page of our website, either belongs to us or we have a permission from the owner to use them to provide the Services. We hereby give you a permission to use the materials and content comprising the Service for the sole purpose of using the Service in accordance with these terms.</p>
                            <p>Your right to use the Services is personal to you and you are not allowed to give this right to another person or to sell, gift or transfer your Account to another person. Your right to use the Services does not stop us from giving other people the right to use the Services.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">How we may use your personal information</h4>
                            <p>We will use any personal information you provide to us to:</p>
                            <p>a) provide the Services; and</p>
                            <p>b) inform you about similar services that we provide, but you may stop receiving these at any time by contacting us.</p>
                            <p>In addition, we may use your name, profile and User Listing information (including information associated with the delivery of that User Listing) with our other users.</p>
                            <p>Further details of how we will process personal information are set out in our Privacy Policy. You should also read our Cookie Policy to understand how we use cookies within the Service.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">Our liability</h4>
                            <p>As we are not the owner of any of the items advertised, we have no control and do not give any commitment relating to the existence, quality, safety, genuineness or legality of the items, the truth or accuracy of any picture or description of the items or any other content made available by users, the ability to swap the items, and whether the instigator/creator will actually complete the swap of the item, and we have no liability in this respect. In any event, you acknowledge that you swap items entirely at your own risk and we have no liability in this respect.</p>
                            <p>We are not responsible or liable for any loss or harm caused by viruses, worms or other programmes designed to impair the Services.</p>
                            <p>Nothing in these terms excludes or limits our liability for:
                            <br/>
                                a) death or personal injury caused by negligence;
                                <br/>
                                b) fraud or fraudulent misrepresentation; and
                                <br/>
                                c) any other liability that cannot be excluded or limited under applicable law.
                            </p>

                            <p>
                                Subject to Clause 8.3, we will not be liable to you, whether in contract, tort (including negligence), for breach of statutory duty, or otherwise, arising under or in connection with the terms of this agreement for:
                                <br/>
                                a) loss of profits;
                                <br/>
                                b) loss of sales or business;
                                <br/>
                                c) loss of use or corruption of software, data or information; and
                                <br/>
                                d) any indirect or consequential loss.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">ending our relationship</h4>
                            <p>If you wish to end your use of the Services, please contact us at hello@loopcycle.io from the email address linked to your account and ask us to deactivate your Account.
                                <br/>
                                We may immediately end your use of the Services if you break any of the terms of our Acceptable Use Policy or any terms and conditions, we set for accessing and using the Service including these terms.
                                <br/>
                                We may also withdraw the Services for any reason, without notice, at any time and without any liability to you.</p>
                        </section>

                        <section className="mb-4">
                            <h4 className="text-capitalize">GENERAL</h4>
                            <p>
                                We may revise these terms and conditions from time to time and we will try, where possible and reasonable, to contact you to let you know about any significant changes to any of the documents referred to in these terms and conditions. Nevertheless, your continued use of the Service shall constitute acceptance of such revised terms of Service.
                                <br/><br/>
                                We may assign any of our rights and obligations under these terms and conditions.
                                <br/><br/>
                                These terms do not create an agency, partnership, employment or joint venture relationship between you and us.
                                <br/><br/>
                                Each of the provisions of these terms operates separately. If any provision of these terms is deemed invalid, illegal or for any reason unenforceable, then that provision will be deemed deleted and will not affect the validity and enforceability of the remaining provisions.
                                <br/><br/>
                                We may delay enforcing our rights under these terms without waiving or losing the right to do so later. No failure by us to exercise any right or remedy under these terms or otherwise shall constitute a waiver of the right subsequently to exercise those or any other rights or remedies.
                                <br/><br/>
                                These terms are made between you and us and no other person shall have any rights to enforce any of the provisions of these terms, whether under the Contracts (Rights of Third Parties) Act 1999 or otherwise.
                                <br/><br/>
                                These terms, our Website Terms and Condition, Privacy Policy, Acceptable Use Policy and Cookie Policy constitute the entire agreement between you and us in relation to their subject matter, and supersede and extinguish all previous agreements, promises, assurances, warranties, representations and understandings between us, whether written or oral, in relation to that subject matter. Supplemental terms and policies may also apply to your use of Loopcycle Marketplace and Services. To the extent those supplemental terms conflict with these terms, the supplemental terms will govern with respect to your use of those Services to the extent of the conflict.
                                <br/><br/>
                                These terms are governed by English law and you can bring legal proceedings in respect of the products in the English courts. If you live in Scotland you can bring legal proceedings in respect of the products in either the Scottish or the English courts. If you live in Northern Ireland you can bring legal proceedings in respect of the Services in either the Northern Irish or the English courts.
                            </p>
                        </section>


                    </div>
                </div>
            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default TermsAndService;
