import React, { useEffect } from "react";
import HeaderDark from "../../views/header/HeaderDark";
import Footer from "../../views/Footer/Footer";

const AcceptableUse = ({ title, header, footer }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {header ? header : <HeaderDark />}
            <div className="container mb-5" style={{ marginTop: "100px" }}>
                <div className="row mt-5 mb-5">
                    <div className="col">
                        <h3 className="blue-text">{title ? title : "Acceptable Use"}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">

                        <section className="mb-4">
                            <h4>PLEASE READ THE TERMS OF THIS POLICY CAREFULLY BEFORE USING THE SITE</h4>
                        </section>

                        <section className="mb-4">
                            <h4>What's in these terms?</h4>
                            <p>This acceptable use policy sets out the content standards that apply when you upload content to our site, make contact with other users on our site, link to our site, or interact with our site in any other way,</p>
                        </section>

                        <section className="mb-4">
                            <h4>Who we are and how to contact us</h4>
                            <p>www.loopcycle.io is a site operated by Loop Infinity Ltd ("We"). We are registered in England and Wales under company number 11456617 and have our registered office and main trading address at Camden Collective, 5-7 Buck Street, London NW1 8NJ.
                                <br/>
                                We are a limited company.
                                <br/>
                                To contact us, please email hello@loopcycle.io.</p>
                        </section>

                        <section className="mb-4">
                            <h4>By using our site you accept these terms</h4>
                            <p>By using our site, you confirm that you accept the terms of this policy and that you agree to comply with them.
                                <br/>
                                If you do not agree to these terms, you must not use our site.
                                <br/>
                                We recommend that you print a copy of these terms for future reference.
                                <br/>
                                There are other terms that may apply to you.
                                <br/>
                                Our Terms of website use also apply to your use of our site.</p>
                        </section>

                        <section className="mb-4">
                            <h4>We may make changes to the terms of this policy</h4>
                            <p>We amend these terms from time to time. Every time you wish to use our site, please check these terms to ensure you understand the terms that apply at that time. </p>
                        </section>

                        <section className="mb-4">
                            <h4>Prohibited uses</h4>
                            <p>You may use our site only for lawful purposes.  You may not use our site:</p>
                            <p>
                                In any way that breaches any applicable local, national or international law or regulation.
                                <br/>
                                In any way that is unlawful or fraudulent or has any unlawful or fraudulent purpose or effect.
                                <br/>
                                For the purpose of harming or attempting to harm minors in any way.
                                <br/>
                                To bully, insult, intimidate or humiliate any person.
                                <br/>
                                To send, knowingly receive, upload, download, use or re-use any material which does not comply with our content standards detailed in the next section below.
                                <br/>
                                To transmit, or procure the sending of, any unsolicited or unauthorised advertising or promotional material or any other form of similar solicitation (spam).
                                <br/>
                                To knowingly transmit any data, send or upload any material that contains viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation of any computer software or hardware.
                                <br/>
                                <b>You also agree:</b>
                                <br/>
                                Not to reproduce, duplicate, copy or re-sell any part of our site in contravention of the provisions of our terms of website use .
                                <br/>
                                Not to access without authority, interfere with, damage or disrupt:
                                <br/>
                                any part of our site;
                                <br/>
                                any equipment or network on which our site is stored;
                                <br/>
                                any software used in the provision of our site; or
                                <br/>
                                any equipment or network or software owned or used by any third party.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Interactive services</h4>
                            <p>We may from time to time provide interactive services on our site, including, without limitation:</p>
                            <p>
                                Chat rooms.
                                <br/>
                                Bulletin boards.
                                <br/>
                                Internal messaging.
                                <br/>
                                Networking features.
                                <br/>
                                <b>(interactive services.)</b>
                                <br/><br/>
                                Where we do provide any interactive service, we will provide clear information to you about the kind of service offered, if it is moderated and what form of moderation is used (including whether it is human or technical).
                                <br/><br/>
                                We will do our best to assess any possible risks for users (and in particular, for children) from third parties when they use any interactive service provided on our site, and we will decide in each case whether it is appropriate to use moderation of the relevant service (including what kind of moderation to use) in the light of those risks. However, we are under no obligation to oversee, monitor or moderate any interactive service we provide on our site, and we expressly exclude our liability for any loss or damage arising from the use of any interactive service by a user in contravention of our content standards, whether the service is moderated or not.
                                <br/><br/>
                                The use of any of our interactive services by a minor is subject to the consent of their parent or guardian. We advise parents who permit their children to use an interactive service that it is important that they communicate with their children about their safety online, as moderation is not fool proof. Minors who are using any interactive service should be made aware of the potential risks to them.
                                <br/><br/>
                                Where we do moderate an interactive service, we will normally provide you with a means of contacting the moderator, should a concern or difficulty arise.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Content standards</h4>
                            <p>
                                These content standards apply to any and all material which you contribute to our site (Contribution), and to any interactive services associated with it.
                                <br/>
                                The Content Standards must be complied with in spirit as well as to the letter. The standards apply to each part of any Contribution as well as to its whole.
                                <br/>
                                Loop Infinity Ltd will determine, in its discretion, whether a Contribution breaches the Content Standards.
                            </p>

                            <p>
                                <b>A Contribution must:</b>
                                <br/>
                                Be accurate (where it states facts).
                                <br/>
                                Be genuinely held (where it states opinions).
                                <br/>
                                Comply with the law applicable in England and Wales and in any country from which it is posted.
                                <br/><br/>
                                <b>A Contribution must not:</b>
                                <br/>
                                Be defamatory of any person.
                                <br/>
                                Be obscene, offensive, hateful or inflammatory.
                                <br/>
                                Bully, insult, intimidate or humiliate.
                                <br/>
                                Promote sexually explicit material.
                                <br/>
                                Include child sexual abuse material.
                                <br/>
                                Promote violence.
                                <br/>
                                Promote discrimination based on race, sex, religion, nationality, disability, sexual orientation or age.
                                <br/>
                                Infringe any copyright, database right or trademark of any other person.
                                <br/>
                                Be likely to deceive any person.
                                <br/>
                                Breach any legal duty owed to a third party, such as a contractual duty or a duty of confidence.
                                <br/>
                                Promote any illegal activity.
                                <br/>
                                Be in contempt of court.
                                <br/>
                                Be threatening, abuse or invade another's privacy, or cause annoyance, inconvenience or needless anxiety.
                                <br/>
                                Be likely to harass, upset, embarrass, alarm or annoy any other person.
                                <br/>
                                Impersonate any person, or misrepresent your identity or affiliation with any person.
                                <br/>
                                Give the impression that the Contribution emanates from Loop Infinity Ltd, if this is not the case.
                                <br/>
                                Advocate, promote, incite any party to commit, or assist any unlawful or criminal act such as (by way of example only) copyright infringement or computer misuse.
                                <br/>
                                Contain a statement which you know or believe, or have reasonable grounds for believing, that members of the public to whom the statement is, or is to be, published are likely to understand as a direct or indirect encouragement or other inducement to the commission, preparation or instigation of acts of terrorism.
                                <br/>
                                Contain any advertising or promote any services or web links to other sites.

                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Breach of this policy</h4>
                            <p>
                                When we consider that a breach of this acceptable use policy has occurred, we may take such action as we deem appropriate.
                                <br/>
                                Failure to comply with this acceptable use policy constitutes a material breach of the terms of use upon which you are permitted to use our site, and may result in our taking all or any of the following actions:
                                <br/><br/>
                                Immediate, temporary or permanent withdrawal of your right to use our site.
                                <br/>
                                Immediate, temporary or permanent removal of any Contribution uploaded by you to our site.
                                <br/>
                                Issue of a warning to you.
                                <br/>
                                Legal proceedings against you for reimbursement of all costs on an indemnity basis (including, but not limited to, reasonable administrative and legal costs) resulting from the breach.
                                <br/>
                                Further legal action against you.
                                <br/>
                                Disclosure of such information to law enforcement authorities as we reasonably feel is necessary or as required by law.
                                <br/><br/>
                                We exclude our liability for all action we may take in response to breaches of this acceptable use policy. The actions we may take are not limited to those described above, and we may take any other action we reasonably deem appropriate.

                            </p>
                        </section>

                        <section className="mb-4">
                            <h4>Which country's laws apply to any disputes?</h4>
                            <p>
                                If you are a consumer, please note that the terms of this policy, its subject matter and its formation are governed by English law. You and we both agree that the courts of England and Wales will have exclusive jurisdiction except that if you are a resident of Northern Ireland you may also bring proceedings in Northern Ireland, and if you are resident of Scotland, you may also bring proceedings in Scotland.
                                <br/><br/>
                                If you are a business, the terms of this policy, its subject matter and its formation (and any non-contractual disputes or claims) are governed by English law. We both agree to the exclusive jurisdiction of the courts of England and Wales.
                            </p>
                        </section>


                    </div>
                </div>
            </div>
            {footer ? footer : <Footer />}
        </div>
    );
};

export default AcceptableUse;
