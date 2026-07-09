import PostsList from "@/components/posts/PostsList";
import { Suspense } from "react";
import SectionHeading from "@/components/common/SectionHeading";

export default function Posts() {
  return (
    <main>
      <section className="section blog">
        <div className="inner">
          <SectionHeading
            title="Notes"
            lead="Web開発、教育活動、ルワンダでの経験を記録しています。"
          />

          <Suspense>
            <PostsList postLimit={10} pagination={true} searchBar={true} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: "junsan14｜BLOG",
};