import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Infrastructure from '@/components/Infrastructure'
import Templates from '@/components/Templates'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      {/* Header导航栏 - 高度64px */}
      <Header />
      
      {/* 主要内容区域 */}
      <main>
        {/* Hero区域 - 彩虹渐变背景 */}
        <Hero />
        
        {/* 特性标签页区域 - AI Apps/Web Apps等 */}
        <Features />
        
        {/* 基础设施展示区域 - Git部署、协作、监控等 */}
        <Infrastructure />
        
        {/* 模板展示区域 - Next.js/React等模板 */}
        <Templates />
      </main>
      
      {/* Footer页脚 */}
      <Footer />
    </>
  )
}