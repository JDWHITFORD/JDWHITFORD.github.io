# Joshua Whitford's Arthrex Technical Assignment

JDW January 16 2024 - Arthrex simple assignment for viewing, placing, and manipulating STLs.
Summary follows. Created here on github after request from recruiting. Will be flagged as private and/or deleted after review.
Commits made to main for expedience - normal commit procedures are to create a bug in a tracker, new branch per bug.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Assumptions and Line of Thinking](#assumptions)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

This is an application made to ingest a 3D model of a human bones (scapula) and presents the ability to add a socket (sphere)
to a location of the user's choosing. 

Givens:
1. A 3D Model of a scapula (in STEP and STL formats)
2. Sketch (Picture1.jpg) depicting a basic axis system on the ball, anchored Scapula w/ desired orientation
3. 24 hours to complete, so compromises must be made

Requirements:
  Create a sphere in a CAD program.
    40mm_Sphere.stl

  Create a program to ingest the scapula and the ball.
    Stretch: Create a UI (Sliders as in the VIP App)

  Align the sphere with the glenoid surface.

  After import, user should be able to manipulate the ball - check the given sketch.

  Movement is 5mm (!) increments.

## Features

A lit scene of the scapula, currently the files are hard-coded but given more time could be selectable w/ a dialog.
Provides agency to the users to select the right starting point for the socket.
Adds a gizmo to enable the users to move the socket in 5mm increments:
    a.  Anterior/Posterior (forward and backward)

    b.  Medial/Lateral (in and out)

    c.  Superior/Inferior (up and down)

## Getting Started

To test this, you'll need to host it somewhere and update the host variables / references

OR

Using a common program like Visual Studio Code and a lightweight server addon like Live Server
start up a live local http server (Code assumes the default port of 5500)

Then, open index.html and follow the prompts

## Usage

Once the application is started, users can follow the prompts on the screen for more information.

Camera Controls:
  Left-click for orbit controls
  Right-click for panning

Clicking the scapula model anywhere will place the sphere in the world, and then enable gizmo-based controls for transformation.

## Assumptions and Line of Thinking

Limited time means I am not reinventing the wheel.
   Given time, we could write something that interprets an STL (or any other file type) and does all the work manually.
   Positives there are complete control, and no licenses to worry about.
   Negatives - time, maintenance, security, etc. all on the shoulders of the developers.

Limited time means I am using something familiar.
   On the phone, VTK was mentioned, as was Unity.
   I am not familiar with VTK, and Unity is overkill, plus I don't know the target hardware.
   Decision: I will use three.js, which from what I see is very similar to VTK.
   Runs in any browser, is performant, is free even for commercial use, and lends itself well to this project.

Fusion360 was used for the Sphere. a 20mm radius arc was rotated around the Z axis.

Given more time, I would have liked to have added some slider-based controls to increase familiarity based on the VIP software seen on YouTube. Similarly, familiar diction (anterior, posterior, media, lateral, superior, inferior could have been assigned to the sliders)

Try/catch for some of the function calls for better error handling, and I would've liked more time to throw wildly different geometries at this and some curveballs in the file types (and improved the handling of, say, OBJ and Step files)

## License

For private exchange only.

## Acknowledgements

As mentioned above, I used three.js rather than trying to create a whole visualization program in 24 hours.
three.js was chosen among other reasons for its permissive MIT license:

The MIT License

Copyright © 2010-2024 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



