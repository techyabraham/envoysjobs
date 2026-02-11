"use client";

import DashboardShell from "@/components/DashboardShell";
import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <DashboardShell userName="Grace">
      <PageShell title="Webinars" description="Recorded sessions to help you grow and deliver with excellence.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.youtube.com/embed/R0Pq-mXu9kA"
              title="Building Excellence in Service Delivery"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h3 className="text-lg mt-4">Building Excellence in Service Delivery</h3>
        </div>
        

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.youtube.com/embed/LMhkLnHNwRA"
              title="Economic Community and Growth"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h3 className="text-lg mt-4">Economic Community and Growth</h3>
        </div>
        

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.youtube.com/embed/pMyoUfV3Nmk?start=46"
              title="Marketplace Opportunities Deep Dive"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h3 className="text-lg mt-4">Marketplace Opportunities Deep Dive</h3>
        </div>
        

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.youtube.com/embed/tU0Zj3bb4oE"
              title="From Skill to Impact"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h3 className="text-lg mt-4">From Skill to Impact</h3>
        </div>
        

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.youtube.com/embed/o5ngGNpu614"
              title="Trusted Delivery Standards"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h3 className="text-lg mt-4">Trusted Delivery Standards</h3>
        </div>
        
        </div>
      </PageShell>
    </DashboardShell>
  );
}
