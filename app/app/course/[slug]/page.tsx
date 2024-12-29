import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { formatDate } from '@/utils/parse-mdx'
import { baseUrl } from '@/app/_helpers/shared/config'
import dbConnect from '@/lib/dbConnect'
import { Course } from '@/models/Course'
import NavBarMain from '@/components/NavBarMain'
import { textColorBasedOnBackgroundHexadecimal } from '@/lib/utils'
const getCourses = async () => {
  await dbConnect()
  const courses = await Course.find({ isPublished: true })
  return courses
}
export async function generateStaticParams() {
  const courses = await getCourses()

  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params
  const course = (await getCourses()).find((course) => course.slug === slug)
  if (!course) {
    return
  }
const { title, description, image } = course
  // const {
  //   title,
  //   publishedAt: publishedTime,
  //   summary: description,
  //   image,
  // } = course.metadata
   const ogImage = image
     ? image
     : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    // title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: course.updatedAt,
      url: `${baseUrl}/course/${course.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params,
  searchParams,
}: {
  params: any,
  searchParams: any
}) {
  const bgColour  = (await searchParams).bgColour || 'ffcc00'
  const { slug } = await params
  const course = (await getCourses()).find((course) => course.slug === slug)

  if (!course) {
    notFound()
  }
  const backgroundColor = bgColour ? '#'+bgColour : '#ffffff'
  return (
    <main style={{ backgroundColor, color: textColorBasedOnBackgroundHexadecimal(backgroundColor) }}>
      <NavBarMain type="header" />
    <section >
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            headline: course.title,
            // datePublished: course.metadata.publishedAt,
            // dateModified: course.metadata.publishedAt,
            description: course.summary,
            image: course.image
              ? `${baseUrl}${course.image}`
              : `/og?title=${encodeURIComponent(course.title)}`,
            url: `${baseUrl}/blog/${course.slug}`,
            author: {
              '@type': 'Person',
              name: course.authorName,
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {course.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm">
          {formatDate(course.updatedAt.toString())}
        </p>
        <p className="text-sm">
          By {course.authorName}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={course.content} />
      </article>
    </section>
    </main>
  )
}
