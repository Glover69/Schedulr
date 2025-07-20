import gsap from "gsap";

export function animateDrawer(state: string, element: any, callback?: () => void) {
  // const element = drawerRef?.nativeElement;
    if (!element){
        console.log("No element!")
        return;
    }

    switch (state) {
      case 'open':
        console.log('hello')
        gsap.to(element, {
          y: 0,
          duration: 0.25,
          ease: 'power3.inOut',
        });
        break;
      case 'close':
        gsap.fromTo(
          element,
          {
            y: 0,
          },
          {
            y: '100%',
            duration: 0.25,
            ease: 'power3.out',
            onComplete: () => {
              callback?.();
            },
          }
        );
    }
}
