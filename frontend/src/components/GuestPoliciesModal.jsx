import React from 'react';

const s = {
    overlay: { position:'fixed',inset:0,zIndex:1000,background:'rgba(15,46,30,0.65)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' },
    modal: { background:'#FBFFE4',width:'100%',maxWidth:'1020px',height:'90vh',borderRadius:'16px',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 24px 64px rgba(15,46,30,0.3)' },
    hdr: { background:'#3D8D7A',padding:'1.5rem 2rem',display:'flex',alignItems:'center',gap:'1.25rem',justifyContent:'space-between',flexShrink:0 },
    hdrLeft: { display:'flex',alignItems:'center',gap:'1rem' },
    hdrLogo: { width:'60px',height:'60px',objectFit:'contain',borderRadius:'50%',background:'#fff',padding:'5px',flexShrink:0 },
    eyebrow: { color:'rgba(251,255,228,0.8)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.25em',margin:'0 0 3px' },
    hdrTitle: { color:'#FBFFE4',fontFamily:'"Playfair Display",serif',fontSize:'1.35rem',fontWeight:600,margin:'0 0 2px' },
    hdrSub: { color:'rgba(251,255,228,0.82)',fontSize:'0.78rem',margin:0 },
    closeBtn: { background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontSize:'0.82rem',fontWeight:600,flexShrink:0 },
    body: { display:'flex',flex:1,overflow:'hidden' },
    nav: { width:'220px',flexShrink:0,borderRight:'1px solid #D8E4D0',padding:'1.5rem 0.75rem',overflowY:'auto',background:'#f5faef' },
    navGrp: { textTransform:'uppercase',letterSpacing:'0.2em',fontSize:'0.6rem',color:'#2C6A5B',fontWeight:600,margin:'1.25rem 0 0.4rem',paddingLeft:'0.5rem' },
    navList: { listStyle:'none',margin:0,padding:0,borderLeft:'2px solid #D8E4D0' },
    navA: { display:'block',padding:'0.35rem 0 0.35rem 0.8rem',marginLeft:'-2px',borderLeft:'2px solid transparent',color:'#4C5A55',fontSize:'0.78rem',lineHeight:1.35,cursor:'pointer' },
    content: { flex:1,overflowY:'auto',padding:'2rem 2.25rem' },
    grpIntro: { paddingBottom:'1.25rem',marginBottom:'0.75rem',borderBottom:'1px solid #D8E4D0' },
    grpTag: { display:'inline-block',textTransform:'uppercase',letterSpacing:'0.2em',fontSize:'0.6rem',color:'#2C6A5B',background:'#E7F2ED',padding:'0.2rem 0.6rem',borderRadius:'999px',marginBottom:'0.4rem' },
    grpTitle: { fontFamily:'"Playfair Display",serif',fontWeight:600,fontSize:'1.5rem',margin:'0 0 0.35rem',color:'#2C6A5B' },
    grpDesc: { color:'#4C5A55',margin:0,fontSize:'0.87rem' },
    policy: { padding:'1.25rem 0',borderBottom:'1px solid #D8E4D0' },
    polHead: { display:'flex',alignItems:'baseline',gap:'0.75rem',marginBottom:'0.6rem' },
    polNo: { fontFamily:'"Playfair Display",serif',color:'#3D8D7A',fontSize:'0.8rem',letterSpacing:'0.05em',whiteSpace:'nowrap' },
    polH3: { fontFamily:'"Playfair Display",serif',fontWeight:600,fontSize:'1.1rem',margin:0,color:'#1F2B27' },
    polUl: { margin:0,paddingLeft:'1rem',color:'#4C5A55' },
    polLi: { marginBottom:'0.4rem',fontSize:'0.86rem',lineHeight:1.55 },
    foot: { padding:'1rem 2rem',borderTop:'1px solid #D8E4D0',background:'#f5faef',textAlign:'center',flexShrink:0 },
    footTxt: { color:'#4C5A55',fontSize:'0.8rem',margin:0 },
    footLink: { color:'#2C6A5B',textDecoration:'none',borderBottom:'1px solid #3D8D7A' },
};

const privacyPolicies = [
    { id:'privacy-collection', no:'01', title:'Information We Collect', items:['Reservation details such as your name, email, phone number, billing address, and payment method.','Identification data required at check-in, such as a government-issued ID or passport number, where required by local law.','Stay preferences and history, including room preferences, special requests, and loyalty program activity.','Technical data from our website and app, such as IP address, device type, and browsing behavior, collected through cookies and similar technologies.'] },
    { id:'privacy-use', no:'02', title:'How We Use Your Information', items:['To process reservations, confirm bookings, and manage check-in and check-out.','To personalize your stay, including remembering preferences for future visits.','To communicate booking confirmations, updates, and, where you\'ve opted in, promotional offers.','To maintain safety and security across our properties, including CCTV monitoring in public areas.','To comply with legal, tax, and regulatory obligations.'] },
    { id:'privacy-sharing', no:'03', title:'Sharing Your Information', items:['We share data with payment processors and booking platforms strictly to complete your transaction.','We may share data with local authorities where required by law.','We do not sell personal data to third parties for marketing purposes.','Service providers who support our operations may process data on our behalf under confidentiality agreements.'] },
    { id:'privacy-cookies', no:'04', title:'Cookies & Tracking', items:['Our website uses essential cookies to operate booking and login functions.','Analytics cookies help us understand site usage and improve our services; these can be disabled in your browser settings.','You can manage cookie preferences at any time through the cookie settings link in our website footer.'] },
    { id:'privacy-security', no:'05', title:'Data Security', items:['We use industry-standard encryption for payment and personal data, both in transit and at rest.','Access to guest data is restricted to authorized staff on a need-to-know basis.','We conduct periodic security reviews of our systems and third-party vendors.'] },
    { id:'privacy-retention', no:'06', title:'Data Retention', items:['Reservation and stay records are retained for as long as required for accounting, legal, and tax purposes, typically up to 7 years.','Marketing data is retained until you withdraw consent or request deletion.','CCTV footage is retained for a limited period, typically 30 days, unless required for an active investigation.'] },
    { id:'privacy-rights', no:'07', title:'Your Rights', items:['You may request access to, correction of, or deletion of your personal data, subject to legal retention requirements.','You may withdraw marketing consent at any time via the unsubscribe link in our emails.','You may request a copy of your data in a portable format where applicable law provides for this.'] },
    { id:'privacy-contact', no:'08', title:'Contact & Complaints', items:['For any privacy-related request, contact our Data Protection Officer at privacy@luxestay.example.','If you believe your data has been mishandled, you may also lodge a complaint with your local data protection authority.'] },
];

const guestPolicies = [
    { id:'guest-checkin', no:'09', title:'Check-In & Check-Out', items:['Standard check-in is from 3:00 PM and check-out is by 11:00 AM local time.','Early check-in and late check-out are subject to availability and may incur an additional charge.','A valid government-issued photo ID is required at check-in for every registered guest aged 18 or older.'] },
    { id:'guest-reservation', no:'10', title:'Reservations & Cancellations', items:['Reservations are confirmed once full or partial payment has been processed.','Free cancellation is available up to 48 hours before arrival unless a stricter policy is stated for your rate.','No-shows and late cancellations may be charged the equivalent of one night\'s stay.','Group bookings of 5 rooms or more follow separate terms provided at the time of quotation.'] },
    { id:'guest-payment', no:'11', title:'Payment & Deposits', items:['A valid credit card is required to guarantee all reservations, including prepaid rates.','A refundable security deposit or pre-authorization may be collected at check-in to cover incidentals.','All rates are subject to applicable local taxes and service charges unless stated as inclusive.'] },
    { id:'guest-age', no:'12', title:'Age Requirements', items:['The primary guest on any reservation must be at least 18 years of age.','Guests under 18 must be accompanied by a parent or legal guardian staying in the same room.'] },
    { id:'guest-occupancy', no:'13', title:'Occupancy & Extra Guests', items:['Each room has a maximum occupancy limit; exceeding it may result in an additional charge or denied entry.','Visitors who are not registered guests must sign in at the front desk and are generally not permitted after 11:00 PM.'] },
    { id:'guest-conduct', no:'14', title:'Guest Conduct', items:['Guests are expected to treat staff and other guests with courtesy and respect at all times.','Excessive noise or disruptive behavior may result in a warning or removal from the property without refund.','LUXESTAY reserves the right to refuse service or end a stay for conduct that endangers safety or violates hotel policy.'] },
    { id:'guest-smoking', no:'15', title:'Smoking Policy', items:['All indoor areas, including guest rooms, are strictly non-smoking.','Smoking is permitted only in designated outdoor areas.','A cleaning fee applies if smoking is detected in a non-smoking room.'] },
    { id:'guest-pets', no:'16', title:'Pet Policy', items:['Pets are welcome at select LUXESTAY properties; please confirm pet-friendly status before booking.','A pet fee may apply, and pets must remain leashed or crated in public areas.','Service animals are welcome at all properties in accordance with applicable law.'] },
    { id:'guest-damage', no:'17', title:'Damage & Liability', items:['Guests are financially responsible for any damage to hotel property caused during their stay.','LUXESTAY is not liable for loss of, or damage to, personal belongings except where caused by hotel negligence.','A safe is provided in-room for valuables; use of hotel safety deposit facilities is recommended for high-value items.'] },
    { id:'guest-housekeeping', no:'18', title:'Housekeeping', items:['Daily housekeeping is provided by default; guests may opt out via the in-room control panel or by request.','A "Do Not Disturb" sign will be honored, though staff may check in after 24 hours for safety purposes.'] },
    { id:'guest-lostfound', no:'19', title:'Lost & Found', items:['Items left behind are logged and held for 90 days before being donated or discarded.','LUXESTAY will make reasonable efforts to contact guests regarding valuable items found in their room.'] },
    { id:'guest-forcemajeure', no:'20', title:'Force Majeure', items:['LUXESTAY is not liable for failure to perform obligations due to events beyond reasonable control, including natural disasters or public health emergencies.','In such cases, affected reservations will be rebooked or refunded at LUXESTAY\'s discretion.'] },
    { id:'guest-law', no:'21', title:'Governing Law', items:['These policies are governed by the laws of the jurisdiction in which the relevant LUXESTAY property is located.','Any disputes will be subject to the exclusive jurisdiction of the courts local to that property.'] },
];

function NavItem({ p }) {
    const [hov, setHov] = React.useState(false);
    return (
        <li>
            <span
                style={{ ...s.navA, ...(hov ? { color:'#3D8D7A', borderLeftColor:'#3D8D7A' } : {}) }}
                onClick={() => { const el = document.getElementById(p.id); el && el.scrollIntoView({ behavior:'smooth', block:'start' }); }}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
            >{p.title}</span>
        </li>
    );
}

function PolicyBlock({ p }) {
    return (
        <div style={s.policy} id={p.id}>
            <div style={s.polHead}>
                <span style={s.polNo}>No. {p.no}</span>
                <h3 style={s.polH3}>{p.title}</h3>
            </div>
            <ul style={s.polUl}>
                {p.items.map((item, i) => <li key={i} style={s.polLi}>{item}</li>)}
            </ul>
        </div>
    );
}

export default function GuestPoliciesModal({ onClose }) {
    return (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div style={s.modal}>
                {/* Header */}
                <div style={s.hdr}>
                    <div style={s.hdrLeft}>
                        <img src="/logo.png" alt="LUXESTAY" style={s.hdrLogo} />
                        <div>
                            <p style={s.eyebrow}>LUXESTAY · Guest Directory</p>
                            <h2 style={s.hdrTitle}>Guest &amp; Privacy Policies</h2>
                            <p style={s.hdrSub}>Everything covering your stay and your data. Last updated July 1, 2026.</p>
                        </div>
                    </div>
                    <button style={s.closeBtn} onClick={onClose}>✕ Close</button>
                </div>

                <div style={s.body}>
                    {/* Side Nav */}
                    <nav style={s.nav}>
                        <p style={{ ...s.navGrp, marginTop: 0 }}>Privacy Policy</p>
                        <ol style={s.navList}>
                            {privacyPolicies.map(p => <NavItem key={p.id} p={p} />)}
                        </ol>
                        <p style={s.navGrp}>Guest Policies</p>
                        <ol style={s.navList} start={9}>
                            {guestPolicies.map(p => <NavItem key={p.id} p={p} />)}
                        </ol>
                    </nav>

                    {/* Content */}
                    <main style={s.content}>
                        <div style={s.grpIntro} id="privacy">
                            <span style={s.grpTag}>Section A</span>
                            <h2 style={s.grpTitle}>Privacy Policy</h2>
                            <p style={s.grpDesc}>This section explains what personal data LUXESTAY collects when you book, stay, or use our digital services, why we collect it, and the choices you have.</p>
                        </div>
                        {privacyPolicies.map(p => <PolicyBlock key={p.id} p={p} />)}

                        <div style={{ ...s.grpIntro, marginTop:'2rem' }} id="guest">
                            <span style={s.grpTag}>Section B</span>
                            <h2 style={s.grpTitle}>Guest Policies</h2>
                            <p style={s.grpDesc}>The house rules that apply to every reservation and every stay at a LUXESTAY property.</p>
                        </div>
                        {guestPolicies.map(p => <PolicyBlock key={p.id} p={p} />)}

                        <div style={{ marginTop:'2rem', paddingTop:'1.5rem', textAlign:'center', borderTop:'1px solid #D8E4D0' }}>
                            <div style={{ width:'40px', height:'2px', background:'#3D8D7A', margin:'0 auto 1rem' }} />
                            <p style={s.footTxt}>Questions about these policies? Contact the front desk or write to <a href="mailto:privacy@luxestay.example" style={s.footLink}>privacy@luxestay.example</a>.</p>
                        </div>
                    </main>
                </div>

                <div style={s.foot}>
                    <p style={s.footTxt}>&copy; 2026 LUXESTAY Hotels Ltd. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
