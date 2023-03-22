import {useEffect, useRef,useState } from "react";
import Matter from 'matter-js';
import './App.css';
import plugins from 'matter-attractors';



function App() {
    const boxRef = useRef(null);
    const canvasRef = useRef(null);
    const [bruh,setBruh] = useState({position:1});
    const requestRef = useRef();
    useEffect(()=>{
        Matter.use(
            'matter-attractors' // PLUGIN_NAME
        );
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composites = Matter.Composites,
            Common = Matter.Common,
            Constraint = Matter.Constraint,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            World = Matter.World,
            Bodies = Matter.Bodies;




        // create engine
        var engine = Engine.create(),
            world = engine.world;
        world.gravity.scale = 0;
        // create renderer
        var render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
                wireframes: false,
                background:'rgb(255,255,255)'
            }
        });

        Render.run(render);
        var defaultCategory = 0x0001,
            redCategory = 0x0002;

        // create runner
        var runner = Runner.create();
        Runner.run(runner, engine);
        var attractiveBody = Bodies.circle(
            render.options.width / 2,
            render.options.height / 2,
           50,
            {
                isStatic: true,
                render: {opacity:0},
                collisionFilter:{
                    mask: redCategory
                },
                // example of an attractor function that
                // returns a force vector that applies to bodyB
                plugin: {
                    attractors: [
                        function(bodyA, bodyB) {
                            return {
                                x: (bodyA.position.x - bodyB.position.x) * 1e-4,
                                y: (bodyA.position.y - bodyB.position.y) * 1e-4,
                            };
                        }
                    ]
                }
            });

        World.add(world, attractiveBody);
// add soft body
        var eee = Bodies.polygon(280, 100, 4, 30,{mass:2,frictionAir: 0.1 ,render: {
                strokeStyle: 'white',
                fillStyle: 'black',
                lineWidth: 3
            }});
        eee.inverseInertia=0;
        setBruh(eee);
        Composite.add(world, [eee]);
        //



        const box = {
            body: Matter.Bodies.rectangle(150, 0, 40, 40,{render:{fillStyle:'white',strokeStyle:'blue',lineWidth:2}}),
            elem: boxRef.current,
            render() {
                const {x, y} = this.body.position;
                this.elem.style.top = `${y-50}px`;
                this.elem.style.left = `${x+5}px`;
                this.elem.style.transform = `rotate(${this.body.angle}rad)`;
            },
        };
        box.body.inverseInertia = 0;
        Composite.add(world, [box.body]);
        // add soft body
        var body = Bodies.polygon(280, 100, 4, 70,{mass:30,frictionAir: 0.1 ,render: {
                fillStyle: 'gray',
                strokeStyle: 'black',
                lineWidth: 3
            }});
        body.inverseInertia=0;
        console.log(body.position.x)
        Composite.add(world, [body]);


        Composite.add(world, [
            // walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    // allow bodies on mouse to rotate
                    angularStiffness: 0,
                    render: {
                        visible: false
                    }
                }
            });

        Composite.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

        // fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        (function rerender() {
            box.render();
            Matter.Engine.update(engine);
            requestRef.current = requestAnimationFrame(rerender);
        })();


    },[setBruh])
    useEffect(()=>{
        console.log(bruh.position.x)
    },[bruh])


  return (
    <div className="App">
<p id='box' ref={boxRef}>Pee</p>
        <div >
            <div

                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "90%",
                    height: "90%",
                    pointerEvents: "none"
                }}
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    </div>
  );
}

export default App;
